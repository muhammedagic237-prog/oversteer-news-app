# Oversteer

Oversteer is a swipe-first car-news app that tries to feel closer to an enthusiast briefing than a generic news reader. Users tune the lane around brands, eras, regions, and motorsport interests, then the app ranks trusted stories by relevance, freshness, and source trust.

## What The MVP Does

- pulls live RSS coverage from trusted automotive and motorsport sources
- falls back to a seeded editorial catalog when feeds are unavailable
- deduplicates overlapping stories and groups them into `Pit Wall` clusters
- keeps onboarding choices, saved stories, muted topics, and watchlists in local storage
- optionally syncs state snapshots and cached feed payloads through Supabase
- exposes deploy-friendly API routes for feed data, health checks, and snapshot syncing

## Stack

- Next.js App Router
- TypeScript
- Handcrafted CSS
- `fast-xml-parser` for RSS parsing
- Supabase server-side routes for optional persistence
- Vercel-ready cron warmup via [vercel.json](/C:/Users/HP/Documents/New%20project/oversteer-news-app/vercel.json)

## Live Data Flow

1. `GET /api/feed` fetches trusted RSS feeds, scores and normalizes stories, and returns a catalog the client can rank locally.
2. If all live feeds fail, the API tries a cached Supabase snapshot.
3. If Supabase is not configured or there is no cached snapshot, the app falls back to the seed catalog in [mock-feed.ts](/C:/Users/HP/Documents/New%20project/oversteer-news-app/lib/mock-feed.ts).
4. The client provider stores interaction state locally first, then syncs it to Supabase when env vars are present.

## Supabase Setup

Copy [.env.example](/C:/Users/HP/Documents/New%20project/oversteer-news-app/.env.example) to `.env.local` and set:

```bash
OVERSTEER_FEED_REVALIDATE_SECONDS=900
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OVERSTEER_STATE_TABLE=user_state_snapshots
OVERSTEER_FEED_TABLE=feed_snapshots
```

Run the SQL in [001_initial_oversteer.sql](/C:/Users/HP/Documents/New%20project/oversteer-news-app/supabase/migrations/001_initial_oversteer.sql) inside Supabase SQL Editor.

Important: this MVP uses device-based snapshot sync, not full user authentication. That is good enough for preview deployments and single-user testing, but proper multi-user auth should come next.

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
- `/api/feed`
- `/api/state`
- `/api/health`

## Production Notes

- Vercel cron warms `/api/feed` every 30 minutes.
- Feed freshness is controlled by `OVERSTEER_FEED_REVALIDATE_SECONDS`.
- Supabase is optional. Without it, the app still works with local storage plus seeded fallback.
- `GET /api/health` gives you a quick readiness check after deployment.

## Source Shape

The live pipeline currently leans on official or publisher-hosted RSS endpoints from:

- Motor1
- Carscoops
- Motorsport.com

That source list lives in [news-sources.ts](/C:/Users/HP/Documents/New%20project/oversteer-news-app/lib/news-sources.ts) and can be expanded without changing the client UI.
