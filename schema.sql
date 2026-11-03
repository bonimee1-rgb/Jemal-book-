-- Jemal Books and Hadith App: Supabase database setup
-- Run this entire file in Supabase Dashboard > SQL Editor.
-- This schema stores catalog metadata. PDF files belong in Supabase Storage.

create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  category text not null,
  language text not null default 'Arabic',
  description text,
  arabic_text text,
  amharic_text text,
  oromoo_text text,
  pdf_path text,
  source_name text,
  source_url text,
  license_note text,
  content_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_title_search_idx
  on public.books using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(author,'') || ' ' || coalesce(description,'')));
create index if not exists books_category_idx on public.books(category);

create table if not exists public.user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);

alter table public.books enable row level security;
alter table public.user_bookmarks enable row level security;

-- Anyone can read the public catalog.
drop policy if exists "Public can read books" on public.books;
create policy "Public can read books" on public.books
  for select using (true);

-- Only authenticated users with the admin role in app_metadata can manage books.
drop policy if exists "Admins can insert books" on public.books;
create policy "Admins can insert books" on public.books
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update books" on public.books;
create policy "Admins can update books" on public.books
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete books" on public.books;
create policy "Admins can delete books" on public.books
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Users read own bookmarks" on public.user_bookmarks;
create policy "Users read own bookmarks" on public.user_bookmarks
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users add own bookmarks" on public.user_bookmarks;
create policy "Users add own bookmarks" on public.user_bookmarks
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users remove own bookmarks" on public.user_bookmarks;
create policy "Users remove own bookmarks" on public.user_bookmarks
  for delete to authenticated using (auth.uid() = user_id);

-- Storage setup:
-- Create a PRIVATE bucket named: jemal-books
-- Keep PDFs private; issue signed URLs after checking access.
-- Storage policies below allow public read only if you intentionally choose a PUBLIC bucket.
-- For a private bucket, use authenticated/admin policies and signed URLs instead.
