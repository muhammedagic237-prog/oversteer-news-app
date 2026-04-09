create table if not exists public.user_state_snapshots (
  device_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feed_snapshots (
  id text primary key,
  payload jsonb not null,
  reports jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.user_state_snapshots enable row level security;
alter table public.feed_snapshots enable row level security;
