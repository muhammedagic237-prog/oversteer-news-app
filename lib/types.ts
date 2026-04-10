export type SourceStyle = "Magazine-led" | "Enthusiast-led" | "Balanced";

export type RankingMode =
  | "Balanced"
  | "Fresh first"
  | "Deep cuts"
  | "Motorsport weekend"
  | "Collector mode";

export type StoryEventType = "Launch" | "Race" | "Rumor" | "Auction" | "Feature";

export type StorySurface = "pole-position" | "your-lane";

export type FeedMode = "live" | "cached" | "seed";

export type RemoteSyncStatus = "disabled" | "offline" | "syncing" | "synced" | "error";

export type PersistenceMode = "disabled" | "device" | "account";

export type RuntimeShellMode =
  | "browser"
  | "standalone-web"
  | "capacitor-ios"
  | "capacitor-android";

export type RuntimeShell = {
  mode: RuntimeShellMode;
  label: string;
  guidance: string;
  ios: boolean;
  android: boolean;
  mobile: boolean;
  standalone: boolean;
  nativeWrapper: boolean;
  canShare: boolean;
  prefersReducedMotion: boolean;
};

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
  imageUrl?: string;
  primaryTopic?: string;
  clusterLabel?: string;
  qualityScore?: number;
};

export type StoryCluster = {
  id: string;
  title: string;
  description: string;
  topic: string;
  leadStoryId: string;
  storyIds: string[];
  timeline: string[];
  storyCount?: number;
  sourceNames?: string[];
};

export type FeedCatalog = {
  articles: Article[];
  storyClusters: StoryCluster[];
  sourceCatalog: string[];
  topicCollections: string[];
  syncedAt: string;
  mode: FeedMode;
};

export type FeedSourceReport = {
  id: string;
  name: string;
  ok: boolean;
  articleCount: number;
  error?: string;
  fetchedAt: string;
};

export type FeedPayload = {
  catalog: FeedCatalog;
  reports: FeedSourceReport[];
};

export type Viewer = {
  id: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

export type StateBootstrapPayload = {
  enabled: boolean;
  authEnabled: boolean;
  persistenceMode: PersistenceMode;
  snapshot: StateSnapshot | null;
  viewer: Viewer | null;
};

export type RankedArticle = Article & {
  score: number;
  reason: string;
  laneSignalCount: number;
};

export type AppState = {
  hasCompletedOnboarding: boolean;
  profile: UserProfile;
  savedStoryIds: string[];
  hiddenStoryIds: string[];
  openedStoryIds: string[];
  hiddenSourceIds: string[];
  currentSurface: StorySurface;
  updatedAt: string;
};

export type StateSnapshot = {
  deviceId: string;
  state: AppState;
  updatedAt: string;
};
