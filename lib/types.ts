export type SourceStyle = "Magazine-led" | "Enthusiast-led" | "Balanced";

export type RankingMode =
  | "Balanced"
  | "Fresh first"
  | "Deep cuts"
  | "Motorsport weekend"
  | "Collector mode";

export type StoryEventType = "Launch" | "Race" | "Rumor" | "Auction" | "Feature";

export type StorySurface = "pole-position" | "your-lane";

export type UserProfile = {
  interests: string[];
  eras: string[];
  motorsport: string[];
  regions: string[];
  followedSources: string[];
  followedTopics: string[];
  mutedTopics: string[];
  watchlistModels: string[];
  sourceStyle: SourceStyle;
  rankingMode: RankingMode;
};

export type Article = {
  id: string;
  title: string;
  summary: string;
  deck: string;
  source: string;
  sourceUrl: string;
  publishedAgo: string;
  publishedAt: string;
  tags: string[];
  regions: string[];
  sourceStyle: Exclude<SourceStyle, "Balanced">;
  trustScore: number;
  freshnessScore: number;
  clusterId: string;
  eventType: StoryEventType;
  heroGradient: string;
};

export type StoryCluster = {
  id: string;
  title: string;
  description: string;
  topic: string;
  leadStoryId: string;
  storyIds: string[];
  timeline: string[];
};

export type RankedArticle = Article & {
  score: number;
  reason: string;
};

export type AppState = {
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  savedStoryIds: string[];
  hiddenStoryIds: string[];
  openedStoryIds: string[];
  hiddenSourceIds: string[];
  currentSurface: StorySurface;
};
