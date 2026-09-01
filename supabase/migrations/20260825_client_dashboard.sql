create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_name text not null,
  project_title text,
  scheduled_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  amount_inr numeric(12, 2) check (amount_inr is null or amount_inr >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  item_type text not null default 'course' check (item_type in ('course', 'beat', 'service', 'digital_product', 'other')),
  order_reference text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'refunded', 'cancelled')),
  amount_inr numeric(12, 2) check (amount_inr is null or amount_inr >= 0),
  purchased_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_idx on public.bookings(user_id, created_at desc);
create index if not exists purchases_user_idx on public.purchases(user_id, purchased_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at before update on public.purchases
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Artist'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, display_name)
select
  user_row.id,
  coalesce(
    nullif(trim(user_row.raw_user_meta_data ->> 'display_name'), ''),
    nullif(split_part(coalesce(user_row.email, ''), '@', 1), ''),
    'Artist'
  )
from auth.users as user_row
on conflict (id) do nothing;

create or replace function public.sync_comment_display_name()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.display_name is distinct from new.display_name then
    update public.blog_comments
    set user_name = new.display_name
    where user_id = new.id;
  end if;
  return new;
end;
$$;

create or replace function public.set_comment_display_name()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  select profile.display_name into new.user_name
  from public.profiles as profile
  where profile.id = new.user_id;

  if new.user_name is null then
    new.user_name := 'Artist';
  end if;
  return new;
end;
$$;

drop trigger if exists blog_comments_set_display_name on public.blog_comments;
create trigger blog_comments_set_display_name
before insert or update of user_name, user_id on public.blog_comments
for each row execute function public.set_comment_display_name();

drop trigger if exists profiles_sync_comment_name on public.profiles;
create trigger profiles_sync_comment_name
after update of display_name on public.profiles
for each row execute function public.sync_comment_display_name();

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.purchases enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select to authenticated using (auth.uid() = id);

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can read own bookings" on public.bookings;
create policy "Users can read own bookings" on public.bookings
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can read own purchases" on public.purchases;
create policy "Users can read own purchases" on public.purchases
for select to authenticated using (auth.uid() = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select on public.bookings to authenticated;
grant select on public.purchases to authenticated;
grant select on public.blog_comments, public.blog_comment_votes to anon, authenticated;
grant insert, update, delete on public.blog_comments, public.blog_comment_votes to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'blog_comments'
    ) then
      alter publication supabase_realtime add table public.blog_comments;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'blog_comment_votes'
    ) then
      alter publication supabase_realtime add table public.blog_comment_votes;
    end if;
  end if;
end;
$$;
