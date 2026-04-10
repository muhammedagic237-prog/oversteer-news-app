import Link from "next/link";
import { notFound } from "next/navigation";

import { AppNav } from "@/components/app-nav";
import { getTransmissionBySlug } from "@/lib/gearbox-center";

export function TransmissionDetailScreen({ slug }: { slug: string }) {
  const family = getTransmissionBySlug(slug);

  if (!family) {
    notFound();
  }

  const heroStyle = family.heroImageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8, 10, 13, 0.16) 0%, rgba(8, 10, 13, 0.88) 84%), url(${family.heroImageUrl})`,
      }
    : undefined;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">How it works?</p>
          <h1>{family.name}</h1>
          <p className="hero-copy brand-subtitle">{family.summary}</p>
        </div>
      </header>

      <section className="story-detail-shell tech-detail-hero" style={heroStyle}>
        <div className="news-card-content">
          <div className="news-card-header">
            <span className="source-pill">{family.category}</span>
            <span className="source-pill muted">{family.layout}</span>
          </div>
          <h2 className="section-title">{family.whyItMatters}</h2>
          <p className="story-deck">
            Oversteer keeps this section honest: public family specs come from ZF product pages,
            while service notes and fluid guidance come from ZF Aftermarket pages.
          </p>
          <div className="button-row">
            <Link href="/tech" className="secondary-button">
              Back to Tech Center
            </Link>
            <a href={family.sources[0].url} className="primary-button" target="_blank" rel="noreferrer">
              Open primary source
            </a>
          </div>
        </div>
      </section>

      <section className="grid-panels" style={{ marginTop: 24 }}>
        <article className="panel">
          <p className="eyebrow">Fact sheet</p>
          <div className="spec-grid">
            {family.factSheet.map((fact) => (
              <div key={fact.label} className="spec-card">
                <strong>{fact.label}</strong>
                <span>{fact.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Applications</p>
          <ul className="timeline-list">
            {family.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">How it works</p>
          <ul className="timeline-list">
            {family.howItWorks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Maintenance</p>
          <ul className="timeline-list">
            {family.maintenance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Fluid guidance</p>
          <ul className="timeline-list">
            {family.fluidGuidance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Sources</p>
          <ul className="stack-list">
            {family.sources.map((source) => (
              <li key={source.url} className="list-card align-start">
                <div>
                  <strong>{source.label}</strong>
                  <p>{source.note ?? source.tier}</p>
                </div>
                <a href={source.url} className="secondary-button" target="_blank" rel="noreferrer">
                  Open
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {family.media.length > 0 ? (
        <section className="panel" style={{ marginTop: 24 }}>
          <p className="eyebrow">Media</p>
          <div className="tech-grid">
            {family.media.map((item) => (
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
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <AppNav current="tech" />
    </main>
  );
}
