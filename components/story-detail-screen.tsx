"use client";

import Link from "next/link";
import { useEffect } from "react";

import { AppNav } from "@/components/app-nav";
import { useOversteer } from "@/components/oversteer-provider";
import { getArticleById, getClusterById } from "@/lib/mock-feed";
import { getClusterStories } from "@/lib/personalization";

export function StoryDetailScreen({ storyId }: { storyId: string }) {
  const {
    state,
    hydrated,
    toggleSavedStory,
    followTopic,
    muteTopic,
    markStoryOpened,
  } = useOversteer();

  const article = getArticleById(storyId);

  if (!article) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Missing story</p>
          <h1>We couldn&apos;t find that article.</h1>
        </section>
      </main>
    );
  }

  const cluster = getClusterById(article.clusterId);
  const relatedStories = hydrated
    ? getClusterStories(article.clusterId, state).filter((story) => story.id !== article.id)
    : [];

  useEffect(() => {
    if (hydrated) {
      markStoryOpened(article.id);
    }
  }, [article.id, hydrated, markStoryOpened]);

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Story detail</p>
          <h1>{article.title}</h1>
        </div>
      </header>

      <section className="story-detail-shell" style={{ background: article.heroGradient }}>
        <div className="news-card-content">
          <div className="news-card-header">
            <span className="source-pill">{article.source}</span>
            <span className="source-pill muted">{article.publishedAgo}</span>
            <span className="source-pill muted">{article.eventType}</span>
          </div>

          <p className="story-summary">{article.summary}</p>
          <p className="story-deck">{article.deck}</p>

          <div className="chip-grid">
            {article.tags.map((tag) => (
              <button key={tag} type="button" className="pill" onClick={() => followTopic(tag)}>
                {tag}
              </button>
            ))}
          </div>

          <div className="button-row">
            <a href={article.sourceUrl} className="primary-button" target="_blank" rel="noreferrer">
              Open original source
            </a>
            <button type="button" onClick={() => toggleSavedStory(article.id)}>
              {state.savedStoryIds.includes(article.id) ? "Saved" : "Save story"}
            </button>
            <button type="button" onClick={() => muteTopic(article.tags[0])}>
              Less like this
            </button>
            {cluster ? (
              <Link href={`/pit-wall/${cluster.id}`} className="secondary-button" onClick={() => markStoryOpened(article.id)}>
                Open Pit Wall
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {relatedStories.length > 0 ? (
        <section className="panel" style={{ marginTop: 24 }}>
          <p className="eyebrow">Related coverage</p>
          <ul className="stack-list">
            {relatedStories.map((story) => (
              <li key={story.id} className="list-card align-start">
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.reason}</p>
                </div>
                <Link href={`/story/${story.id}`} className="secondary-button" onClick={() => markStoryOpened(story.id)}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AppNav current="feed" />
    </main>
  );
}
