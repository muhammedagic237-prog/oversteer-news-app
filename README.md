# Oversteer

Oversteer is a personalized car-news app concept with a vertical, swipe-first feed. Users pick the cars, eras, brands, and motorsport interests they care about, and the app ranks stories by relevance, freshness, and source trust instead of dumping every article into one noisy list.

This repo now contains:

- a product specification in [docs/product-spec.md](/C:/Users/HP/Documents/New%20project/docs/product-spec.md)
- a screen-by-screen UI plan in [docs/ui-plan.md](/C:/Users/HP/Documents/New%20project/docs/ui-plan.md)
- a starter Next.js app shell for onboarding, feed, garage, and settings

## Product Direction

The first version should optimize for three things:

1. Trust: only ingest from a vetted publisher list and clearly show the source and publish time.
2. Relevance: rank stories using the user's selected interests and interaction history.
3. Flow: make the feed feel effortless, with fullscreen cards and scroll-snapping instead of a cluttered article list.

## Suggested Stack

- Next.js App Router
- TypeScript
- CSS variables plus handcrafted styling
- Supabase for auth, saved stories, topic preferences, and interaction history
- A background ingestion job for trusted-source fetching, deduplication, and ranking

## Starter Structure

```text
app/
  garage/page.tsx
  onboarding/page.tsx
  settings/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  app-nav.tsx
  feed-shell.tsx
  news-card.tsx
  onboarding-form.tsx
lib/
  mock-feed.ts
  personalization.ts
  types.ts
docs/
  product-spec.md
  ui-plan.md
```

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The current app uses mock data so we can validate the experience before wiring in real source ingestion.

## What To Build Next

1. Replace mock articles with a real ingestion pipeline from approved car-news sources.
2. Persist onboarding selections, saves, mutes, and follows.
3. Add source deduplication so five articles about the same BMW rumor collapse into one cluster.
4. Add article detail pages with outbound-source links and related stories.
5. Add notifications for topic follows, race weekends, and breaking launches.
