import { AppNav } from "@/components/app-nav";
import { FeedShell } from "@/components/feed-shell";
import { getDefaultProfile, getPersonalizedFeed } from "@/lib/personalization";

export default function HomePage() {
  const profile = getDefaultProfile();
  const feed = getPersonalizedFeed(profile);

  return (
    <main className="page page-feed">
      <header className="topbar">
        <div>
          <p className="eyebrow">Trusted enthusiast feed</p>
          <h1>Oversteer</h1>
        </div>
        <div className="topbar-meta">
          <span className="pill">BMW</span>
          <span className="pill">Oldtimers</span>
          <span className="pill">Sports Cars</span>
        </div>
      </header>

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Today&apos;s lane</p>
          <h2>Only the car stories that match your taste and pass the trust filter.</h2>
        </div>
        <p className="hero-copy">
          The starter feed ranks stories by source quality, freshness, and how closely
          they match the brands and eras you follow.
        </p>
      </section>

      <FeedShell articles={feed} />
      <AppNav current="feed" />
    </main>
  );
}
