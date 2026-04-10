# Oversteer

Oversteer is a swipe-first car-news app that tries to feel closer to an enthusiast briefing than a generic news reader. Users tune the lane around brands, eras, regions, and motorsport interests, then the app ranks trusted stories by relevance, freshness, and source trust.

## What The MVP Does

- pulls live RSS coverage from trusted automotive and motorsport sources
- falls back to a seeded editorial catalog when feeds are unavailable
- deduplicates overlapping stories and groups them into smarter `Pit Wall` clusters
- keeps onboarding choices, saved stories, muted topics, and watchlists in local storage
- supports Supabase auth plus account-backed sync when public and service keys are configured
- exposes deploy-friendly API routes for feed data, health checks, and snapshot syncing

## Stack

- Next.js App Router
- TypeScript
- Handcrafted CSS
- `@supabase/ssr` plus Supabase Auth
- `fast-xml-parser` for RSS parsing
- Supabase-backed profile, preference, and library persistence
- Vercel-ready cron warmup via [vercel.json](/C:/Users/HP/Documents/New%20project/oversteer-news-app/vercel.json)

## Live Data Flow

1. `GET /api/feed` fetches trusted RSS feeds, scores and normalizes stories, and returns a catalog the client can rank locally.
2. If all live feeds fail, the API tries a cached Supabase snapshot.
3. If Supabase is not configured or there is no cached snapshot, the app falls back to the seed catalog in [mock-feed.ts](/C:/Users/HP/Documents/New%20project/oversteer-news-app/lib/mock-feed.ts).
4. The client provider stores interaction state locally first, then syncs either by device snapshot or signed-in account, depending on what Supabase keys are configured.

## Supabase Setup

Copy [.env.example](/C:/Users/HP/Documents/New%20project/oversteer-news-app/.env.example) to `.env.local` and set:

```bash
OVERSTEER_FEED_REVALIDATE_SECONDS=900
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=...
OVERSTEER_STATE_TABLE=user_state_snapshots
OVERSTEER_FEED_TABLE=feed_snapshots
```

Run both SQL files in order:

- [001_initial_oversteer.sql](/C:/Users/HP/Documents/New%20project/oversteer-news-app/supabase/migrations/001_initial_oversteer.sql)
- [002_auth_app_schema.sql](/C:/Users/HP/Documents/New%20project/oversteer-news-app/supabase/migrations/002_auth_app_schema.sql)

The second migration adds:

- `profiles`
- `user_preferences`
- `user_saved_stories`
- `user_hidden_stories`
- `user_opened_stories`
- `user_hidden_sources`
- an auth trigger that creates profile and preferences rows for new users

## Local Development

```bash
npm install
npm run dev
```

Useful routes:

- `/` feed
- `/explore`
- `/garage`
- `/settings`
- `/login`
- `/account`
- `/auth/confirm`
- `/api/feed`
- `/api/state`
- `/api/health`

## Production Notes

- Vercel cron warms `/api/feed` every 30 minutes.
- Feed freshness is controlled by `OVERSTEER_FEED_REVALIDATE_SECONDS`.
- `proxy.ts` keeps Supabase auth sessions fresh across route changes.
- Supabase is optional. Without it, the app still works with local storage plus seeded fallback.
- `GET /api/health` gives you a quick readiness check after deployment.

## Source Shape

The live pipeline currently leans on official or publisher-hosted RSS endpoints from:

- Motor1
- Carscoops
- Motorsport.com

That source list lives in [news-sources.ts](/C:/Users/HP/Documents/New%20project/oversteer-news-app/lib/news-sources.ts) and can be expanded without changing the client UI.
