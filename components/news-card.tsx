import Link from "next/link";

import type { RankedArticle } from "@/lib/types";

export function NewsCard({ article }: { article: RankedArticle }) {
  return (
    <article
      className="news-card"
      style={{
        background: article.heroGradient,
      }}
    >
      <div className="news-card-content">
        <div className="news-card-header">
          <span className="source-pill">{article.source}</span>
          <span className="source-pill muted">{article.publishedAgo}</span>
          <span className="source-pill muted">{article.clusterCount} viewpoints</span>
        </div>

        <div className="story-meta">
          <h3>{article.title}</h3>
          <p className="story-summary">{article.summary}</p>
        </div>

        <div className="chip-grid">
          {article.tags.map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="reason-strip">
          <strong>Why you see this</strong>
          <span>{article.reason}</span>
        </div>

        <div className="story-actions" aria-label={`Actions for ${article.title}`}>
          <Link href={`/story/${article.id}`} className="pill">
            Open story
          </Link>
          <button type="button">Save</button>
          <button type="button">Less like this</button>
          <button type="button">Follow topic</button>
        </div>
      </div>
    </article>
  );
}
