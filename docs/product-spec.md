# Oversteer Product Spec

## Summary

Oversteer is a car-news product for people who want fewer, better, more relevant stories. The app opens into a fullscreen vertical feed that feels familiar like short-form media, but the product promise is trust and relevance rather than raw volume.

The core question the app should answer is:

"What are the most relevant, credible car stories for me right now?"

## Audience

Primary audiences:

- performance-car fans who follow launches, rumors, tests, and motorsport
- classic-car fans who care about oldtimers, restorations, auctions, and heritage stories
- brand loyalists who want dense coverage of makes like BMW, Porsche, Mercedes-AMG, Ferrari, Honda, or Toyota
- mixed-interest readers who want a clean feed without general-news noise

## Jobs To Be Done

- show me the biggest car stories I care about without making me search five sites
- help me discover good stories without feeding me clickbait
- give me a fast way to mute topics I do not care about
- let me save stories for later and follow specific brands or themes
- tell me why a story is in my feed so the app feels intelligent, not random

## Product Principles

1. Trust first
Only ingest from approved automotive publishers, manufacturers, motorsport organizations, and trusted magazines.

2. Personalization with control
Users should be able to follow, mute, and tune interests explicitly. The ranking engine should never feel like a black box.

3. Feed speed over feature bloat
The feed must load fast, scroll smoothly, and show the headline, source, summary, and why-it-matched reason immediately.

4. Low-noise curation
The app should deduplicate near-identical stories and avoid filling the feed with repeated rumors from low-value sources.

## User Demands The Product Should Solve

Based on current digital-news trends, the most important needs are:

- stronger trust signals because many users worry about misinformation
- personalized feeds because audiences increasingly consume news in social and video-driven formats
- clearer source transparency so readers can judge credibility quickly
- less overload and more filtering so the feed feels useful instead of exhausting

## MVP Features

### 1. Onboarding and Interest Graph

Users choose:

- brands: BMW, Audi, Mercedes-Benz, Porsche, Ferrari, Toyota, Honda, and more
- eras: modern, 80s, 90s, classics, oldtimers
- body styles and niches: sports cars, supercars, wagons, trucks, off-road, hot hatches
- motorsport: F1, WEC, rally, drifting, GT3
- regions: Europe, Japan, USA, global

The first feed should be usable after one minute of onboarding.

### 2. Trusted-Source Feed

Each card shows:

- hero visual
- headline
- source
- publish time
- short summary
- tags
- why this story is shown
- trust badge or source tier

### 3. Relevance Ranking

Ranking inputs for MVP:

- explicit interest matches
- muted-topic exclusion
- source trust tier
- freshness
- interaction history like saves, follows, hides, and article opens

### 4. Story Clustering and Deduplication

If multiple sources cover the same launch or rumor:

- keep one lead card in feed
- show related coverage count
- let the user open the cluster for alternate viewpoints

### 5. Save, Hide, Follow, Mute

Quick actions on each story:

- save for later
- hide story
- less like this
- mute topic
- follow brand or theme

### 6. Garage

The Garage is the user's collection area:

- saved stories
- followed brands and topics
- recently opened stories
- source preferences

### 7. Settings

Users can tune:

- notification cadence
- countries and source language
- topic follows and mutes
- "freshness vs depth" ranking preference
- "mainstream vs enthusiast" source mix

## Post-MVP Features

- AI summaries with source-grounded citations
- event-mode feeds for launches or race weekends
- community lists like "Best BMW sources"
- watchlists for models like E46 M3, 911 GT3, or Land Cruiser
- price and auction coverage for classics
- YouTube and podcast ingestion from approved creators
- offline reading
- local language summaries

## Trust and Accuracy System

### Source Policy

Sources must be manually whitelisted. Start with:

- manufacturer newsrooms
- established automotive publications
- trusted motorsport outlets

Do not ingest random AI-generated blogs or anonymous aggregators.

### Story Processing Pipeline

1. Fetch feed items from approved sources.
2. Normalize publisher, publish date, tags, and canonical URLs.
3. Detect duplicates and assign a cluster ID.
4. Enrich with topic tags, brand tags, region tags, and story type.
5. Score for trust, freshness, and user relevance.
6. Store explanations for ranking so the UI can say why the story appears.

### Ranking Formula

MVP scoring example:

- +25 for each strong interest match
- +10 for followed brand/topic
- +10 for high-trust source
- +8 for freshness
- -100 for muted topic
- -20 for repeated hidden source/topic behavior

## Data Model

Suggested tables:

- users
- user_interests
- sources
- articles
- article_clusters
- article_tags
- user_saved_articles
- user_hidden_articles
- user_topic_preferences
- user_source_preferences
- notifications

## Success Metrics

Track:

- day-1 and day-7 retention
- stories opened per session
- save rate
- hide and mute rate
- follow rate
- repeat session frequency
- percentage of feed consumed before exit

Quality metrics:

- duplicate story rate
- stale story rate
- low-trust source rate
- user-reported bad recommendations

## MVP Scope Recommendation

Build this in three phases:

### Phase 1

- onboarding
- mock or limited source feed
- ranking by explicit interests
- vertical fullscreen feed
- save and hide

### Phase 2

- real ingestion pipeline
- deduplication
- Garage
- settings and notifications

### Phase 3

- AI summaries
- story clusters
- source tuning
- premium experiments if needed later
