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
    viewer,
    authEnabled,
    persistenceMode,
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
  const leadStageStyle = leadStory?.imageUrl
    ? {
        backgroundImage: `linear-gradient(125deg, rgba(7, 10, 13, 0.2) 0%, rgba(7, 10, 13, 0.78) 48%, rgba(7, 10, 13, 0.94) 100%), url(${leadStory.imageUrl})`,
      }
    : {
        background: leadStory?.heroGradient,
      };

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
      <header className="topbar topbar-feed">
        <div className="brand-lockup">
          <p className="eyebrow">Trusted enthusiast feed</p>
          <h1>Oversteer</h1>
          <p className="hero-copy brand-subtitle">
            Swipe through the stories that actually matter to your lane.
          </p>
        </div>
        <div className="topbar-actions">
          <div className="topbar-meta">
            {state.profile.followedTopics.slice(0, 3).map((topic) => (
              <button key={topic} type="button" className="pill" onClick={() => followTopic(topic)}>
                {topic}
              </button>
            ))}
          </div>
          <Link href={viewer ? "/account" : "/login"} className="primary-button">
            {viewer ? viewer.displayName ?? "Account" : authEnabled ? "Sign in" : "Auth pending"}
          </Link>
        </div>
      </header>

      {!state.hasCompletedOnboarding ? (
        <section className="setup-banner">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Build your lane so Oversteer knows whether to lead with BMW launches or rally-era classics.</h2>
          </div>
          <div className="setup-banner-actions">
            <p className="hero-copy">
              The app is already live with feed ingestion, account sync, and clustering. Finish onboarding
              and the lane becomes much sharper immediately.
            </p>
            <Link href="/onboarding" className="primary-button">
              Finish onboarding
            </Link>
          </div>
        </section>
      ) : null}

      {leadStory ? (
        <section className="lead-stage" style={leadStageStyle}>
          <div className="lead-stage-copy">
            <p className="eyebrow">Pole Position</p>
            <h2>{leadStory.title}</h2>
            <p className="lead-summary">{leadStory.summary}</p>
            <p className="hero-copy">{leadStory.deck}</p>
            <div className="status-row">
              <span className="status-pill">{leadStory.source}</span>
              <span className="status-pill muted">{leadStory.publishedAgo}</span>
              <span className="status-pill muted">{leadStory.primaryTopic ?? leadStory.tags[0]}</span>
              <span className="status-pill muted">{Math.round((leadStory.qualityScore ?? 0.78) * 100)} quality</span>
            </div>
          </div>
          <div className="lead-stage-sidebar">
            <div className="lead-briefing">
              <p className="eyebrow">Lane status</p>
              <div className="briefing-grid">
                <div>
                  <strong>{feedLoading ? "Refreshing" : catalog.mode.toUpperCase()}</strong>
                  <span>Feed state</span>
                </div>
                <div>
                  <strong>{healthySources}/{sourceReports.length || 1}</strong>
                  <span>Trusted sources up</span>
                </div>
                <div>
                  <strong>{persistenceMode === "account" ? "Account" : persistenceMode === "device" ? "Device" : "Local"}</strong>
                  <span>Persistence mode</span>
                </div>
                <div>
                  <strong>{state.savedStoryIds.length}</strong>
                  <span>Stories in Garage</span>
                </div>
              </div>
            </div>
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
              <Link href={viewer ? "/account" : "/login"} className="secondary-button">
                {viewer ? "Open account" : "Create driver account"}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="lane-panel" style={{ marginBottom: 24 }}>
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
          <span className="status-pill muted">
            {viewer
              ? `Signed in as ${viewer.displayName ?? viewer.email.split("@")[0]}`
              : authEnabled
                ? "Auth ready"
                : "Auth not configured"}
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
