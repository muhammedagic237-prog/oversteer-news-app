import { AppNav } from "@/components/app-nav";
import { mockSavedStories, preferredSources, topicCollections } from "@/lib/mock-feed";

export default function GaragePage() {
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
          <ul className="stack-list">
            {mockSavedStories.map((story) => (
              <li key={story.id} className="list-card">
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.source}</p>
                </div>
                <span className="pill muted">{story.publishedAgo}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Followed collections</p>
          <div className="chip-grid">
            {topicCollections.map((collection) => (
              <span key={collection} className="pill">
                {collection}
              </span>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Trusted sources</p>
          <div className="chip-grid">
            {preferredSources.map((source) => (
              <span key={source} className="pill muted">
                {source}
              </span>
            ))}
          </div>
        </article>
      </section>

      <AppNav current="garage" />
    </main>
  );
}
