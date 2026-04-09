export type UserProfile = {
  interests: string[];
  regions: string[];
  followedSources: string[];
  mutedTopics: string[];
  sourceStyle: "Magazine-led" | "Enthusiast-led" | "Balanced";
};

export type Article = {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAgo: string;
  tags: string[];
  regions: string[];
  trustScore: number;
  freshnessScore: number;
  sourceStyle: "Magazine-led" | "Enthusiast-led";
  clusterCount: number;
  heroGradient: string;
};

export type RankedArticle = Article & {
  score: number;
  reason: string;
};
