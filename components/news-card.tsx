import Link from "next/link";

import { useOversteer } from "@/components/oversteer-provider";
import { getClusterById } from "@/lib/mock-feed";
import type { RankedArticle } from "@/lib/types";

const auxiliaryTags = new Set([
  "Europe",
  "USA",
  "Japan",
  "Global",
  "Modern",
  "90s",
  "80s",
  "70s",
  "Heritage",
  "Feature",
  "Track",
  "Strategy",
  "Factory Teams",
  "Collector mode",
]);

function getActionTopic(article: RankedArticle) {
  return article.tags.find((tag) => !auxiliaryTags.has(tag)) ?? article.tags[0];
}

type NewsCardProps = {
  article: RankedArticle;
  isSaved: boolean;
  isTopicFollowed: boolean;
  onOpenStory: (storyId: string) => void;
  onToggleSave: (storyId: string) => void;
  onHideStory: (storyId: string) => void;
  onFollowTopic: (topic: string) => void;
  onMuteTopic: (topic: string) => void;
};

export function NewsCard({
  article,
  isSaved,
  isTopicFollowed,
  onOpenStory,
  onToggleSave,
  onHideStory,
  onFollowTopic,
  onMuteTopic,
}: NewsCardProps) {
  const { catalog } = useOversteer();
  const cluster = getClusterById(article.clusterId, catalog);
  const actionTopic = getActionTopic(article);
  const mediaStyle = article.imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(7, 8, 10, 0.08) 0%, rgba(7, 8, 10, 0.84) 82%, rgba(7, 8, 10, 0.95) 100%), url(${article.imageUrl})`,
      }
    : {
        background: article.heroGradient,
      };

  return (
    <article className="news-card">
      <div className="news-card-media" style={mediaStyle} />
      <div className="news-card-content">
        <div className="news-card-header">
          <span className="source-pill">{article.source}</span>
          <span className="source-pill muted">{article.publishedAgo}</span>
          <span className="source-pill muted">{article.eventType}</span>
          {article.primaryTopic ? (
            <span className="source-pill muted">{article.primaryTopic}</span>
          ) : null}
          {cluster ? (
            <Link href={`/pit-wall/${cluster.id}`} className="source-pill muted">
              {(cluster.storyCount ?? cluster.storyIds.length)} viewpoints
            </Link>
          ) : null}
        </div>

        <div className="story-meta">
          <h3>{article.title}</h3>
          <p className="story-summary">{article.summary}</p>
          <p className="story-deck">{article.deck}</p>
        </div>

        <div className="metric-row">
          <span>{Math.round(article.trustScore * 100)} trust</span>
          <span>{Math.round((article.qualityScore ?? article.freshnessScore) * 100)} quality</span>
          <span>{article.laneSignalCount} lane matches</span>
          <span>{article.clusterLabel ?? "Single angle"}</span>
        </div>

        <div className="chip-grid">
          {article.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`pill ${isTopicFollowed && tag === actionTopic ? "pill-active" : ""}`}
              onClick={() => onFollowTopic(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="reason-strip">
          <strong>Why you see this</strong>
          <span>{article.reason}</span>
        </div>

        <div className="story-actions" aria-label={`Actions for ${article.title}`}>
          <Link
            href={`/story/${article.id}`}
            className="pill"
            onClick={() => onOpenStory(article.id)}
          >
            Open story
          </Link>
          <button type="button" onClick={() => onToggleSave(article.id)}>
            {isSaved ? "Saved" : "Save"}
          </button>
          <a href={article.sourceUrl} className="pill" target="_blank" rel="noreferrer">
            Open source
          </a>
          <button type="button" onClick={() => onMuteTopic(actionTopic)}>
            Less like this
          </button>
          <button type="button" onClick={() => onFollowTopic(actionTopic)}>
            {isTopicFollowed ? "Following topic" : "Follow topic"}
          </button>
          <button type="button" onClick={() => onHideStory(article.id)}>
            Hide story
          </button>
        </div>
      </div>
    </article>
  );
}
