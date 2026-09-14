-- Additive migration. Existing customers, bookings and reviews are untouched.
begin;
create table if not exists public.studio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.studio_admins enable row level security;
revoke all on public.studio_admins from anon, authenticated;
grant select on public.studio_admins to authenticated;
create policy "Admins can see their own membership" on public.studio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.studio_content (
  id integer primary key check (id = 1),
  data jsonb check (data is null or (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 600000)),
  version integer not null default 0,
  updated_at timestamptz not null default now()
);
insert into public.studio_content(758ee70b-fe72-471f-86ed-7811f3d3b42d) values(1) on conflict (user_id) do nothing;
alter table public.studio_content enable row level security;
revoke all on public.studio_content from anon, authenticated;
grant select on public.studio_content to anon, authenticated;
create policy "Published studio content is public" on public.studio_content
  for select to anon, authenticated using (true);

create table if not exists public.studio_content_history (
  version integer primary key,
  data jsonb,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now()
);
alter table public.studio_content_history enable row level security;
revoke all on public.studio_content_history from anon, authenticated;
grant select on public.studio_content_history to authenticated;
create policy "Only admins can read history" on public.studio_content_history
  for select to authenticated using (exists(select 1 from public.studio_admins where user_id = (select auth.uid())));

create or replace function public.publish_studio_content(new_data jsonb, expected_version integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare current_version integer;
begin
  if auth.uid() is null or not exists(select 1 from public.studio_admins where user_id = auth.uid()) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if new_data is null or jsonb_typeof(new_data) <> 'object' or octet_length(new_data::text) > 600000 then
    raise exception 'Invalid content' using errcode = '22023';
  end if;
  select version into current_version from public.studio_content where id = 1 for update;
  if current_version is null or current_version <> expected_version then
    raise exception 'Content version conflict' using errcode = '40001';
  end if;
  insert into public.studio_content_history(version, data, published_by)
    values(current_version + 1, new_data, auth.uid());
  update public.studio_content set data = new_data, version = current_version + 1, updated_at = now() where id = 1;
  return current_version + 1;
end;
$$;
revoke all on function public.publish_studio_content(jsonb, integer) from public, anon;
grant execute on function public.publish_studio_content(jsonb, integer) to authenticated;
commit;

-- ONE-TIME: create an email/password user in Supabase Auth, then add their UUID:
-- insert into public.studio_admins(user_id) values ('ADMIN_USER_UUID');
-- Grant access only through this table; public signups can never self-promote.
