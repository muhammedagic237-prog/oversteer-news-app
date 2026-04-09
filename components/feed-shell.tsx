import { NewsCard } from "@/components/news-card";
import type { RankedArticle } from "@/lib/types";

export function FeedShell({ articles }: { articles: RankedArticle[] }) {
  return (
    <section className="feed-shell" aria-label="Personalized story feed">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </section>
  );
}
