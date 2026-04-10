"use client";

import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import { useOversteer } from "@/components/oversteer-provider";
import { rankingModes } from "@/lib/app-shell";
import { sourceStyles } from "@/lib/taxonomy";

export function SettingsScreen() {
  const {
    state,
    hydrated,
    catalog,
    viewer,
    authEnabled,
    syncStatus,
    remoteSyncEnabled,
    persistenceMode,
    setRankingMode,
    setSourceStyle,
    toggleFollowSource,
    unmuteTopic,
    hideSource,
    unhideSource,
  } = useOversteer();

  if (!hydrated) {
    return null;
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Control center</p>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Account</p>
          <div className="setting-row">
            <div>
              <strong>
                {viewer
                  ? `Signed in as ${viewer.displayName ?? viewer.email}`
                  : authEnabled
                    ? "No driver account connected"
                    : "Auth not configured"}
              </strong>
              <span>
                {viewer
                  ? "Your Oversteer lane can follow you across devices."
                  : authEnabled
                    ? "Create an account to sync your lane and Garage."
                    : "Add Supabase public auth keys to unlock accounts."}
              </span>
            </div>
            <Link href={viewer ? "/account" : "/login"} className="secondary-button">
              {viewer ? "Open account" : "Sign in"}
            </Link>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Ranking mode</p>
          <div className="chip-grid">
            {rankingModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`pill ${state.profile.rankingMode === mode ? "pill-active" : "muted"}`}
                onClick={() => setRankingMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Source style</p>
          <div className="chip-grid">
            {sourceStyles.map((style) => (
              <button
                key={style}
                type="button"
                className={`pill ${state.profile.sourceStyle === style ? "pill-active" : "muted"}`}
                onClick={() => setSourceStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Followed sources</p>
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
          <p className="eyebrow">Muted topics</p>
          <div className="chip-grid">
            {state.profile.mutedTopics.length > 0 ? (
              state.profile.mutedTopics.map((topic) => (
                <button key={topic} type="button" className="pill muted" onClick={() => unmuteTopic(topic)}>
                  Unmute {topic}
                </button>
              ))
            ) : (
              <span className="empty-copy">Nothing muted yet.</span>
            )}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Blocked sources</p>
          <div className="chip-grid">
            {state.hiddenSourceIds.length > 0 ? (
              state.hiddenSourceIds.map((source) => (
                <button
                  key={source}
                  type="button"
                  className="pill muted"
                  onClick={() => unhideSource(source)}
                >
                  Restore {source}
                </button>
              ))
            ) : (
              catalog.sourceCatalog.slice(0, 4).map((source) => (
                <button
                  key={source}
                  type="button"
                  className="pill muted"
                  onClick={() => hideSource(source)}
                >
                  Block {source}
                </button>
              ))
            )}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Cloud sync</p>
          <div className="setting-row">
            <div>
              <strong>{remoteSyncEnabled ? "Supabase snapshot sync active" : "Local-first mode"}</strong>
              <span>
                {remoteSyncEnabled
                  ? `Current status: ${syncStatus}. Sync mode: ${persistenceMode}.`
                  : "Set Supabase env vars to sync preferences and saved stories across devices."}
              </span>
            </div>
            <span className="status-pill muted">{syncStatus}</span>
          </div>
        </article>
      </section>

      <AppNav current="settings" />
    </main>
  );
}
