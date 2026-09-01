-- Client portal, structured booking flow, and community safeguards.
-- Run after 20260825_blog_discussions.sql in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Artist' check (char_length(trim(display_name)) between 1 and 50),
  avatar_url text,
  phone text check (phone is null or char_length(phone) between 8 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service text not null check (service in ('Recording & Mixing', 'Beat Production', 'Video Production', 'Music Courses')),
  preferred_date date not null,
  preferred_time time not null,
  project_details text not null check (char_length(trim(project_details)) between 10 and 1500),
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_date_idx on public.bookings(user_id, preferred_date desc);
create unique index if not exists bookings_active_slot_idx on public.bookings(preferred_date, preferred_time) where status <> 'cancelled';

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  amount_inr integer check (amount_inr is null or amount_inr >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'partial', 'paid', 'refunded')),
  purchased_at timestamptz not null default now()
);

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  service text not null,
  status text not null default 'brief' check (status in ('brief', 'production', 'recording', 'mixing', 'mastering', 'delivered')),
  progress smallint not null default 0 check (progress between 0 and 100),
  delivery_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.purchases enable row level security;
alter table public.client_projects enable row level security;

create policy "Users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users create own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users read own bookings" on public.bookings for select to authenticated using (auth.uid() = user_id);
create policy "Users request own bookings" on public.bookings for insert to authenticated with check (auth.uid() = user_id and status = 'requested');
create policy "Users cancel requested bookings" on public.bookings for update to authenticated
  using (auth.uid() = user_id and status = 'requested')
  with check (auth.uid() = user_id and status = 'cancelled');

create policy "Users read own purchases" on public.purchases for select to authenticated using (auth.uid() = user_id);
create policy "Users read own projects" on public.client_projects for select to authenticated using (auth.uid() = user_id);

-- Keep profile creation consistent for email/password and social sign-ins.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'user_name'), ''), split_part(new.email, '@', 1), 'Artist'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Community moderation fields and reporting.
alter table public.blog_comments add column if not exists edited_at timestamptz;
alter table public.blog_comments add column if not exists is_hidden boolean not null default false;

create table if not exists public.blog_comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.blog_comments(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'off-topic', 'other')),
  details text check (details is null or char_length(details) <= 500),
  created_at timestamptz not null default now(),
  unique(comment_id, reporter_id)
);

alter table public.blog_comment_reports enable row level security;
create policy "Users create reports" on public.blog_comment_reports for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Users read own reports" on public.blog_comment_reports for select to authenticated using (auth.uid() = reporter_id);

-- Prevent rapid comment spam even when the browser is bypassed.
create or replace function public.enforce_comment_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.blog_comments where user_id = new.user_id and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Please wait before posting again.';
  end if;
  return new;
end;
$$;

drop trigger if exists blog_comment_rate_limit on public.blog_comments;
create trigger blog_comment_rate_limit before insert on public.blog_comments for each row execute procedure public.enforce_comment_rate_limit();
