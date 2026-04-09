"use client";

import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { useOversteer } from "@/components/oversteer-provider";
import { getArticleById } from "@/lib/mock-feed";
import { watchlistModels } from "@/lib/taxonomy";
import type { Article } from "@/lib/types";

function isArticle(value: Article | undefined): value is Article {
  return Boolean(value);
}

export function GarageScreen() {
  const {
    state,
    hydrated,
    catalog,
    toggleSavedStory,
    followTopic,
    toggleFollowSource,
    toggleWatchlistModel,
    unhideStory,
  } = useOversteer();

  const savedStories = state.savedStoryIds
    .map((storyId) => getArticleById(storyId, catalog))
    .filter(isArticle);
  const recentStories = state.openedStoryIds
    .map((storyId) => getArticleById(storyId, catalog))
    .filter(isArticle);
  const hiddenStories = state.hiddenStoryIds
    .map((storyId) => getArticleById(storyId, catalog))
    .filter(isArticle);

  if (!hydrated) {
    return null;
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Your library</p>
          <h1>Garage</h1>
        </div>
      </header>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Saved stories</p>
          {savedStories.length > 0 ? (
            <ul className="stack-list">
              {savedStories.map((story) => (
                <li key={story.id} className="list-card align-start">
                  <div>
                    <strong>{story.title}</strong>
                    <p>{story.source}</p>
                  </div>
                  <div className="button-row tight">
                    <Link href={`/story/${story.id}`} className="secondary-button">
                      Open
                    </Link>
                    <button type="button" onClick={() => toggleSavedStory(story.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-copy">Save stories from the feed to build your own issue.</p>
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">Followed topics</p>
          <div className="chip-grid">
            {state.profile.followedTopics.length > 0
              ? state.profile.followedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="pill"
                    onClick={() => followTopic(topic)}
                  >
                    {topic}
                  </button>
                ))
              : catalog.topicCollections.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="pill muted"
                    onClick={() => followTopic(topic)}
                  >
                    Follow {topic}
                  </button>
                ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Watchlists</p>
          <div className="chip-grid">
            {watchlistModels.map((model) => (
              <button
                key={model}
                type="button"
                className={`pill ${state.profile.watchlistModels.includes(model) ? "pill-active" : ""}`}
                onClick={() => toggleWatchlistModel(model)}
              >
                {model}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Preferred sources</p>
          <div className="chip-grid">
            {catalog.sourceCatalog.map((source) => (
              <button
                key={source}
                type="button"
                className={`pill ${state.profile.followedSources.includes(source) ? "pill-active" : "muted"}`}
                onClick={() => toggleFollowSource(source)}
              >
                {source}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Recently opened</p>
          {recentStories.length > 0 ? (
            <ul className="stack-list">
              {recentStories.map((story) => (
                <li key={story.id} className="list-card">
                  <div>
                    <strong>{story.title}</strong>
                    <p>{story.publishedAgo}</p>
                  </div>
                  <Link href={`/story/${story.id}`} className="secondary-button">
                    Reopen
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-copy">Open a few stories and they will land here for easy return trips.</p>
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">Hidden stories</p>
          {hiddenStories.length > 0 ? (
            <ul className="stack-list">
              {hiddenStories.map((story) => (
                <li key={story.id} className="list-card">
                  <div>
                    <strong>{story.title}</strong>
                    <p>{story.source}</p>
                  </div>
                  <button type="button" onClick={() => unhideStory(story.id)}>
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-copy">When you hide stories, they stay out of the lane until you restore them here.</p>
          )}
        </article>
      </section>

      <AppNav current="garage" />
    </main>
  );
}
