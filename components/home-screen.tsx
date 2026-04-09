"use client";

import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { FeedShell } from "@/components/feed-shell";
import { useOversteer } from "@/components/oversteer-provider";
import { getClusterById } from "@/lib/mock-feed";

export function HomeScreen() {
  const {
    state,
    hydrated,
    catalog,
    feed,
    polePosition,
    recommendedTopics,
    sourceReports,
    feedLoading,
    setSurface,
    toggleSavedStory,
    hideStory,
    followTopic,
    muteTopic,
    markStoryOpened,
  } = useOversteer();

  const activeStories = state.currentSurface === "pole-position" ? polePosition : feed;
  const leadStory = polePosition[0];
  const leadCluster = leadStory ? getClusterById(leadStory.clusterId, catalog) : null;
  const healthySources = sourceReports.filter((report) => report.ok).length;

  if (!hydrated) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">Preparing your feed</p>
          <h1>Loading Oversteer...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="page page-feed">
      <header className="topbar">
        <div>
          <p className="eyebrow">Trusted enthusiast feed</p>
          <h1>Oversteer</h1>
        </div>
        <div className="topbar-meta">
          {state.profile.followedTopics.slice(0, 4).map((topic) => (
            <button key={topic} type="button" className="pill" onClick={() => followTopic(topic)}>
              {topic}
            </button>
          ))}
        </div>
      </header>

      {!state.hasCompletedOnboarding ? (
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Build your lane so the app knows whether to lead with BMW launches or rally-era classics.</h2>
          </div>
          <div className="hero-actions">
            <p className="hero-copy">
              The MVP now supports a live feed pipeline with seeded fallback. Finish onboarding
              and your feed, Garage, and settings will start behaving like a real product.
            </p>
            <Link href="/onboarding" className="primary-button">
              Finish onboarding
            </Link>
          </div>
        </section>
      ) : null}

      {leadStory ? (
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Pole Position</p>
            <h2>{leadStory.title}</h2>
          </div>
          <div className="hero-actions">
            <p className="hero-copy">{leadStory.deck}</p>
            <div className="button-row">
              <Link
                href={`/story/${leadStory.id}`}
                className="primary-button"
                onClick={() => markStoryOpened(leadStory.id)}
              >
                Open lead story
              </Link>
              {leadCluster ? (
                <Link href={`/pit-wall/${leadCluster.id}`} className="secondary-button">
                  Open Pit Wall
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel" style={{ marginBottom: 24 }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Feed mode</p>
            <h2 className="section-title">Switch between editorial lead and pure personalized lane</h2>
          </div>
          <div className="button-row">
            <button
              type="button"
              className={`chip-button ${state.currentSurface === "pole-position" ? "active" : ""}`}
              onClick={() => setSurface("pole-position")}
            >
              Pole Position
            </button>
            <button
              type="button"
              className={`chip-button ${state.currentSurface === "your-lane" ? "active" : ""}`}
              onClick={() => setSurface("your-lane")}
            >
              Your Lane
            </button>
          </div>
        </div>

        <div className="chip-grid">
          {recommendedTopics.map((topic) => (
            <button key={topic} type="button" className="pill muted" onClick={() => followTopic(topic)}>
              Follow {topic}
            </button>
          ))}
        </div>

        <div className="status-row">
          <span className="status-pill">
            {feedLoading ? "Refreshing feed..." : `${catalog.mode.toUpperCase()} feed`}
          </span>
          <span className="status-pill muted">
            {healthySources > 0
              ? `${healthySources}/${sourceReports.length} trusted sources healthy`
              : "Seeded fallback active"}
          </span>
        </div>
      </section>

      <FeedShell
        articles={activeStories}
        savedStoryIds={state.savedStoryIds}
        followedTopics={state.profile.followedTopics}
        onOpenStory={markStoryOpened}
        onToggleSave={toggleSavedStory}
        onHideStory={hideStory}
        onFollowTopic={followTopic}
        onMuteTopic={muteTopic}
      />
      <AppNav current="feed" />
    </main>
  );
}
