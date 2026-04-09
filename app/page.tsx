import { AppNav } from "@/components/app-nav";
import { FeedShell } from "@/components/feed-shell";
import { architectureSurfaces } from "@/lib/app-shell";
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
          <p className="eyebrow">Pole Position</p>
          <h2>Only the car stories that match your taste and pass the trust filter.</h2>
        </div>
        <p className="hero-copy">
          The architecture blends an editorial daily lead with a personalized swipe
          feed, story clusters, and a Garage control center so the product feels like an
          enthusiast briefing instead of a generic aggregator.
        </p>
      </section>

      <section className="panel" style={{ marginBottom: 24 }}>
        <p className="eyebrow">App surfaces</p>
        <div className="chip-grid">
          {architectureSurfaces.map((surface) => (
            <span key={surface} className="pill muted">
              {surface}
            </span>
          ))}
        </div>
      </section>

      <FeedShell articles={feed} />
      <AppNav current="feed" />
    </main>
  );
}
