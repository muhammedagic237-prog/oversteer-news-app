"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { AppNav } from "@/components/app-nav";
import { useOversteer } from "@/components/oversteer-provider";

export function ExploreScreen() {
  const { followTopic, toggleFollowSource, hydrated, catalog, feedLoading } = useOversteer();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return catalog.articles.slice(0, 6);
    }

    return catalog.articles.filter((article) =>
      [article.title, article.summary, article.source, ...article.tags].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [catalog.articles, deferredQuery]);

  if (!hydrated) {
    return null;
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Discovery</p>
          <h1>Explore</h1>
        </div>
      </header>

      <section className="panel" style={{ marginBottom: 24 }}>
        <p className="eyebrow">Search the lane</p>
        <label className="search-shell">
          <span className="search-prefix">Find</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="BMW, WEC, oldtimers, GT3 Touring..."
            className="search-input"
          />
        </label>
      </section>

      <section className="grid-panels">
        <article className="panel">
          <p className="eyebrow">Topic jumps</p>
          <div className="chip-grid">
            {catalog.storyClusters.map((cluster) => (
              <Link key={cluster.id} href={`/pit-wall/${cluster.id}`} className="pill">
                {cluster.title}
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Sources</p>
          <div className="chip-grid">
            {catalog.sourceCatalog.map((source) => (
              <button key={source} type="button" className="pill muted" onClick={() => toggleFollowSource(source)}>
                {source}
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Search results</p>
          {feedLoading ? <p className="empty-copy">Refreshing trusted-source coverage...</p> : null}
          <ul className="stack-list">
            {results.map((story) => (
              <li key={story.id} className="list-card align-start">
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.source}</p>
                </div>
                <div className="button-row tight">
                  <button type="button" onClick={() => followTopic(story.tags[0])}>
                    Follow {story.tags[0]}
                  </button>
                  <Link href={`/story/${story.id}`} className="secondary-button">
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <AppNav current="explore" />
    </main>
  );
}
