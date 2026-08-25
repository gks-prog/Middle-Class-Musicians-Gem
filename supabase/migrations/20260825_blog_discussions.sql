create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null default 'community',
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  content text not null check (char_length(trim(content)) between 1 and 5000),
  parent_id uuid references public.blog_comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_post_idx on public.blog_comments(post_slug, created_at desc);
create index if not exists blog_comments_parent_idx on public.blog_comments(parent_id);

create table if not exists public.blog_comment_votes (
  comment_id uuid not null references public.blog_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

alter table public.blog_comments enable row level security;
alter table public.blog_comment_votes enable row level security;

drop policy if exists "Anyone can read blog comments" on public.blog_comments;
create policy "Anyone can read blog comments" on public.blog_comments for select using (true);

drop policy if exists "Authenticated users can comment" on public.blog_comments;
create policy "Authenticated users can comment" on public.blog_comments for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can edit own comments" on public.blog_comments;
create policy "Users can edit own comments" on public.blog_comments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own comments" on public.blog_comments;
create policy "Users can delete own comments" on public.blog_comments for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Anyone can read comment votes" on public.blog_comment_votes;
create policy "Anyone can read comment votes" on public.blog_comment_votes for select using (true);

drop policy if exists "Authenticated users can vote" on public.blog_comment_votes;
create policy "Authenticated users can vote" on public.blog_comment_votes for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can change own votes" on public.blog_comment_votes;
create policy "Users can change own votes" on public.blog_comment_votes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can remove own votes" on public.blog_comment_votes;
create policy "Users can remove own votes" on public.blog_comment_votes for delete to authenticated using (auth.uid() = user_id);
