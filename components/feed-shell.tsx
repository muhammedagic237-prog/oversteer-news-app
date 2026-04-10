import { NewsCard } from "@/components/news-card";
import type { RankedArticle } from "@/lib/types";

type FeedShellProps = {
  articles: RankedArticle[];
  savedStoryIds: string[];
  followedTopics: string[];
  onOpenStory: (storyId: string) => void;
  onToggleSave: (storyId: string) => void;
  onHideStory: (storyId: string) => void;
  onFollowTopic: (topic: string) => void;
  onMuteTopic: (topic: string) => void;
};

export function FeedShell({
  articles,
  savedStoryIds,
  followedTopics,
  onOpenStory,
  onToggleSave,
  onHideStory,
  onFollowTopic,
  onMuteTopic,
}: FeedShellProps) {
  if (articles.length === 0) {
    return (
      <section className="panel">
        <p className="eyebrow">Quiet lane</p>
        <h2 className="section-title">No stories match this lane right now.</h2>
        <p className="empty-copy">
          Try switching feed mode, unmuting a topic, or broadening your regions and interests.
        </p>
      </section>
    );
  }

  return (
    <section className="feed-shell" aria-label="Personalized story feed">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          isSaved={savedStoryIds.includes(article.id)}
          isTopicFollowed={article.tags.some((tag) => followedTopics.includes(tag))}
          onOpenStory={onOpenStory}
          onToggleSave={onToggleSave}
          onHideStory={onHideStory}
          onFollowTopic={onFollowTopic}
          onMuteTopic={onMuteTopic}
        />
      ))}
    </section>
  );
}
