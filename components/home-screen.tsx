"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppNav } from "@/components/app-nav";
import { FeedShell } from "@/components/feed-shell";
import { useOversteer } from "@/components/oversteer-provider";

export function HomeScreen() {
  const router = useRouter();
  const {
    state,
    hydrated,
    catalog,
    viewer,
    authEnabled,
    persistenceMode,
    runtimeShell,
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
  const healthySources = sourceReports.filter((report) => report.ok).length;

  useEffect(() => {
    if (hydrated && !state.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [hydrated, router, state.hasCompletedOnboarding]);

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

  if (!state.hasCompletedOnboarding) {
    return (
      <main className="page">
        <section className="panel">
          <p className="eyebrow">First run</p>
          <h1>Opening your lane setup...</h1>
          <p className="hero-copy">
            Oversteer only asks for preferences once on first launch, then keeps the feed focused
            on those choices until you retune it in Settings.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="page page-feed">
      <header className="feed-hud">
        <div className="feed-hud-copy">
          <p className="eyebrow">Trusted enthusiast lane</p>
          <h1>Oversteer</h1>
          <p className="hero-copy">
            A photo-first car-news feed shaped by your first-run preferences, with original-source
            stories and a separate ZF-based Tech Center.
          </p>
          <div className="status-row">
            <span className="status-pill">
              {feedLoading ? "Refreshing lane..." : `${activeStories.length} stories in lane`}
            </span>
            <span className="status-pill muted">
              {healthySources > 0
                ? `${healthySources}/${sourceReports.length} trusted sources healthy`
                : "Seeded fallback active"}
            </span>
            <span className="status-pill muted">{catalog.mode.toUpperCase()} feed</span>
          </div>
        </div>
        <div className="feed-hud-actions">
          <div className="button-row">
            <button
              type="button"
              className={`chip-button ${state.currentSurface === "your-lane" ? "active" : ""}`}
              onClick={() => setSurface("your-lane")}
            >
              Your Lane
            </button>
            <button
              type="button"
              className={`chip-button ${state.currentSurface === "pole-position" ? "active" : ""}`}
              onClick={() => setSurface("pole-position")}
            >
              Top Now
            </button>
            <Link href="/tech" className="secondary-button">
              How it works?
            </Link>
            <Link href={viewer ? "/account" : "/login"} className="secondary-button">
              {viewer ? "Account" : authEnabled ? "Sign in" : "Auth pending"}
            </Link>
          </div>
          <div className="chip-grid">
            {state.profile.followedTopics.slice(0, 5).map((topic) => (
              <button key={topic} type="button" className="pill" onClick={() => followTopic(topic)}>
                {topic}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="feed-utility-bar">
        <div className="feed-utility-copy">
          <p className="eyebrow">Lane controls</p>
          <h2 className="section-title">Only car news. Your interests. Source-first visuals.</h2>
        </div>
        <div className="feed-utility-actions">
          <span className="status-pill muted">{runtimeShell.label}</span>
          <span className="status-pill muted">
            {persistenceMode === "account" ? "Account sync" : persistenceMode === "device" ? "Device sync" : "Local"}
          </span>
          {recommendedTopics.slice(0, 4).map((topic) => (
            <button key={topic} type="button" className="pill muted" onClick={() => followTopic(topic)}>
              Follow {topic}
            </button>
          ))}
        </div>
      </section>

      {!feedLoading && healthySources === 0 ? (
        <section className="setup-banner feed-warning">
          <div>
            <p className="eyebrow">Feed note</p>
            <h2>Live sources are quiet right now, so the app is falling back to its cached or seeded lane.</h2>
          </div>
          <div className="setup-banner-actions">
            <p className="hero-copy">
              The feed still stays personalized, but the source count drops until the trusted feeds
              respond again.
            </p>
            <Link href="/tech" className="secondary-button">
              Open Tech Center
            </Link>
          </div>
        </section>
      ) : null}

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
