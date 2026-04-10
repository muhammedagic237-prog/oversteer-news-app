create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  interests text[] not null default '{}'::text[],
  eras text[] not null default '{}'::text[],
  motorsport text[] not null default '{}'::text[],
  regions text[] not null default '{}'::text[],
  followed_sources text[] not null default '{}'::text[],
  followed_topics text[] not null default '{}'::text[],
  muted_topics text[] not null default '{}'::text[],
  watchlist_models text[] not null default '{}'::text[],
  source_style text not null default 'Balanced',
  ranking_mode text not null default 'Balanced',
  has_completed_onboarding boolean not null default false,
  current_surface text not null default 'pole-position',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_saved_stories (
  user_id uuid not null references public.profiles (id) on delete cascade,
  story_id text not null,
  saved_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, story_id)
);

create table if not exists public.user_hidden_stories (
  user_id uuid not null references public.profiles (id) on delete cascade,
  story_id text not null,
  hidden_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, story_id)
);

create table if not exists public.user_opened_stories (
  user_id uuid not null references public.profiles (id) on delete cascade,
  story_id text not null,
  opened_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, story_id)
);

create table if not exists public.user_hidden_sources (
  user_id uuid not null references public.profiles (id) on delete cascade,
  source_id text not null,
  hidden_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, source_id)
);

create index if not exists user_saved_stories_user_id_idx on public.user_saved_stories (user_id, saved_at desc);
create index if not exists user_hidden_stories_user_id_idx on public.user_hidden_stories (user_id, hidden_at desc);
create index if not exists user_opened_stories_user_id_idx on public.user_opened_stories (user_id, opened_at desc);
create index if not exists user_hidden_sources_user_id_idx on public.user_hidden_sources (user_id, hidden_at desc);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_saved_stories enable row level security;
alter table public.user_hidden_stories enable row level security;
alter table public.user_opened_stories enable row level security;
alter table public.user_hidden_sources enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "user_preferences_all_own"
on public.user_preferences for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_saved_stories_all_own"
on public.user_saved_stories for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_hidden_stories_all_own"
on public.user_hidden_stories for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_opened_stories_all_own"
on public.user_opened_stories for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_hidden_sources_all_own"
on public.user_hidden_sources for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    split_part(coalesce(new.email, 'driver@oversteer.app'), '@', 1)
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    updated_at = timezone('utc', now());

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
