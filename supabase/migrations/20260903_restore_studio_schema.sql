-- Safely align legacy and upgraded portal schemas without deleting account data.
-- Run after the 20260825 migrations. The later version number also ensures this
-- runs when the older 20260902_client_portal_and_community migration was applied.

alter table public.bookings
  add column if not exists service_name text,
  add column if not exists project_title text,
  add column if not exists project_details text,
  add column if not exists scheduled_at timestamptz,
  add column if not exists amount_inr numeric(12, 2);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'service'
  ) then
    execute 'update public.bookings set service_name = coalesce(service_name, service) where service_name is null';
    execute 'alter table public.bookings alter column service drop not null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'preferred_date'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bookings' and column_name = 'preferred_time'
  ) then
    execute $sql$
      update public.bookings
      set scheduled_at = ((preferred_date + preferred_time) at time zone 'Asia/Kolkata')
      where scheduled_at is null
    $sql$;
    execute 'alter table public.bookings alter column preferred_date drop not null';
    execute 'alter table public.bookings alter column preferred_time drop not null';
  end if;
end;
$$;

update public.bookings
set service_name = 'Studio service'
where service_name is null or trim(service_name) = '';

alter table public.bookings
  alter column service_name set not null,
  alter column status drop default;

alter table public.bookings drop constraint if exists bookings_status_check;
update public.bookings set status = 'pending' where status = 'requested';
alter table public.bookings
  alter column status set default 'pending',
  add constraint bookings_status_check check (status in ('pending', 'confirmed', 'completed', 'cancelled'));

alter table public.bookings drop constraint if exists bookings_project_details_check;
alter table public.bookings
  add constraint bookings_project_details_check
  check (project_details is null or char_length(trim(project_details)) between 10 and 1500);

drop index if exists public.bookings_active_slot_idx;
create unique index bookings_active_slot_idx
  on public.bookings(scheduled_at)
  where scheduled_at is not null and status <> 'cancelled';

drop policy if exists "Users request own bookings" on public.bookings;
drop policy if exists "Users cancel requested bookings" on public.bookings;
drop policy if exists "Users can request own bookings" on public.bookings;
create policy "Users can request own bookings" on public.bookings
for insert to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and amount_inr is null
  and scheduled_at > now()
);

drop policy if exists "Users can cancel pending bookings" on public.bookings;
create policy "Users can cancel pending bookings" on public.bookings
for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id and status = 'cancelled');

revoke update on public.bookings from authenticated;
grant select, insert on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;

-- Normalize purchases created by either portal version.
alter table public.purchases
  add column if not exists item_type text,
  add column if not exists order_reference text,
  add column if not exists status text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'purchases' and column_name = 'payment_status'
  ) then
    execute $sql$
      update public.purchases
      set status = case payment_status
        when 'paid' then 'paid'
        when 'refunded' then 'refunded'
        else 'pending'
      end
      where status is null
    $sql$;
  end if;
end;
$$;

update public.purchases set item_type = 'other' where item_type is null;
update public.purchases set status = 'pending' where status is null;
alter table public.purchases drop constraint if exists purchases_status_check;
alter table public.purchases
  alter column item_type set default 'other',
  alter column item_type set not null,
  alter column status set default 'pending',
  alter column status set not null,
  add constraint purchases_status_check check (status in ('pending', 'paid', 'fulfilled', 'refunded', 'cancelled'));

-- Community editing, reporting, visibility, and server-side spam protection.
alter table public.blog_comments
  add column if not exists edited_at timestamptz,
  add column if not exists is_hidden boolean not null default false;

create table if not exists public.blog_comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.blog_comments(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'off-topic', 'other')),
  created_at timestamptz not null default now(),
  unique(comment_id, reporter_id)
);

alter table public.blog_comment_reports enable row level security;

drop policy if exists "Users create reports" on public.blog_comment_reports;
drop policy if exists "Users can create reports" on public.blog_comment_reports;
create policy "Users can create reports" on public.blog_comment_reports
for insert to authenticated with check (auth.uid() = reporter_id);

drop policy if exists "Users read own reports" on public.blog_comment_reports;
drop policy if exists "Users can read own reports" on public.blog_comment_reports;
create policy "Users can read own reports" on public.blog_comment_reports
for select to authenticated using (auth.uid() = reporter_id);

drop policy if exists "Anyone can read blog comments" on public.blog_comments;
drop policy if exists "Anyone can read visible blog comments" on public.blog_comments;
create policy "Anyone can read visible blog comments" on public.blog_comments
for select using (not is_hidden);

revoke update on public.blog_comments from authenticated;
grant update (content, edited_at) on public.blog_comments to authenticated;
grant select, insert on public.blog_comment_reports to authenticated;

create or replace function public.enforce_comment_rate_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (
    select count(*)
    from public.blog_comments
    where user_id = new.user_id
      and created_at > now() - interval '1 minute'
  ) >= 5 then
    raise exception 'Please wait before posting again.';
  end if;
  return new;
end;
$$;

drop trigger if exists blog_comment_rate_limit on public.blog_comments;
create trigger blog_comment_rate_limit
before insert on public.blog_comments
for each row execute function public.enforce_comment_rate_limit();
