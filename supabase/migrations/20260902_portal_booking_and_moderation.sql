-- Booking requests and community moderation for the upgraded client portal.
-- Run after 20260825_blog_discussions.sql and 20260825_client_dashboard.sql.

alter table public.bookings
  add column if not exists project_details text;

alter table public.bookings
  drop constraint if exists bookings_project_details_check;
alter table public.bookings
  add constraint bookings_project_details_check
  check (project_details is null or char_length(trim(project_details)) between 10 and 1500);

create unique index if not exists bookings_active_slot_idx
  on public.bookings(scheduled_at)
  where scheduled_at is not null and status <> 'cancelled';

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

grant insert on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;

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

drop policy if exists "Users can create reports" on public.blog_comment_reports;
create policy "Users can create reports" on public.blog_comment_reports
for insert to authenticated with check (auth.uid() = reporter_id);

drop policy if exists "Users can read own reports" on public.blog_comment_reports;
create policy "Users can read own reports" on public.blog_comment_reports
for select to authenticated using (auth.uid() = reporter_id);

drop policy if exists "Anyone can read blog comments" on public.blog_comments;
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
