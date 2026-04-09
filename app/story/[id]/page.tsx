import Link from "next/link";
import { notFound } from "next/navigation";

import { mockArticles } from "@/lib/mock-feed";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = mockArticles.find((entry) => entry.id === id);

  if (!article) {
    notFound();
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Story detail</p>
          <h1>{article.title}</h1>
        </div>
      </header>

      <section
        className="panel"
        style={{
          background: article.heroGradient,
        }}
      >
        <div className="news-card-content">
          <div className="news-card-header">
            <span className="source-pill">{article.source}</span>
            <span className="source-pill muted">{article.publishedAgo}</span>
            <span className="source-pill muted">{article.clusterCount} related stories</span>
          </div>

          <p className="story-summary">{article.summary}</p>

          <div className="chip-grid">
            {article.tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>

          <div className="reason-strip">
            <strong>Recommendation logic</strong>
            <span>This story would rank highly for users following {article.tags.slice(0, 2).join(" and ")}.</span>
          </div>

          <div className="button-row">
            <a
              href={article.sourceUrl}
              className="primary-button"
              target="_blank"
              rel="noreferrer"
            >
              Open original source
            </a>
            <Link href="/" className="secondary-button">
              Back to feed
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
