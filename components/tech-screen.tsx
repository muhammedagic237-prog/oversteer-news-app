import Link from "next/link";

import { AppNav } from "@/components/app-nav";
import {
  featuredGearboxMedia,
  howItWorksBasics,
  sourceConfidenceLegend,
  transmissionFamilies,
} from "@/lib/gearbox-center";

export function TechScreen() {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">How it works?</p>
          <h1>Oversteer Tech Center</h1>
          <p className="hero-copy brand-subtitle">
            A small car-information center inside the app: latest enthusiast news in the main lane,
            then a ZF-first gearbox knowledge base built from official sources.
          </p>
        </div>
      </header>

      <section className="tech-hero" style={{ marginBottom: 24 }}>
        <div className="tech-hero-copy">
          <p className="eyebrow">What this section is for</p>
          <h2>
            Learn how the hardware works, where the public specs come from, and what ZF actually
            publishes before anyone guesses at service data.
          </h2>
          <p className="hero-copy">
            This section deliberately keeps source confidence visible. We lead with official ZF
            product pages, then ZF Aftermarket service material, then official ZF media for images
            and videos.
          </p>
          <div className="button-row">
            <Link href="/settings" className="primary-button">
              Retune your lane
            </Link>
            <Link href="/" className="secondary-button">
              Back to the feed
            </Link>
          </div>
        </div>
        <div className="tech-hero-panel">
          <p className="eyebrow">Source confidence</p>
          <div className="confidence-stack">
            {sourceConfidenceLegend.map((entry) => (
              <div key={entry.tier} className="confidence-card">
                <strong>{entry.tier}</strong>
                <span>{entry.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-panels" style={{ marginBottom: 24 }}>
        <article className="panel">
          <p className="eyebrow">Start here</p>
          <h2 className="section-title">Transmission families</h2>
          <div className="tech-grid">
            {transmissionFamilies.map((family) => (
              <Link
                key={family.slug}
                href={`/tech/${family.slug}`}
                className="tech-card"
                style={
                  family.heroImageUrl
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(8, 10, 13, 0.12) 0%, rgba(8, 10, 13, 0.88) 84%), url(${family.heroImageUrl})`,
                      }
                    : undefined
                }
              >
                <div className="tech-card-content">
                  <span className="source-pill">{family.name}</span>
                  <span className="source-pill muted">{family.category}</span>
                  <h3>{family.summary}</h3>
                  <p>{family.whyItMatters}</p>
                  <span className="ghost-link">Open family brief</span>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Foundation guides</p>
          <h2 className="section-title">How it works and how to service it responsibly</h2>
          <ul className="stack-list">
            {howItWorksBasics.map((item) => (
              <li key={item.slug} className="list-card align-start">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
                <a href={item.media[0].url} className="secondary-button" target="_blank" rel="noreferrer">
                  Open source
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Featured media</p>
          <h2 className="section-title">Official visuals and videos</h2>
          <div className="tech-grid">
            {featuredGearboxMedia.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="tech-card tech-card-media"
                style={
                  item.imageUrl
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(8, 10, 13, 0.16) 0%, rgba(8, 10, 13, 0.9) 82%), url(${item.imageUrl})`,
                      }
                    : undefined
                }
              >
                <div className="tech-card-content">
                  <span className="source-pill">{item.kind}</span>
                  <span className="source-pill muted">{item.sourceLabel}</span>
                  <h3>{item.title}</h3>
                  <p>Open the original ZF media or guide page.</p>
                </div>
              </a>
            ))}
          </div>
        </article>
      </section>

      <AppNav current="tech" />
    </main>
  );
}
