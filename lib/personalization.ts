import { seedFeedCatalog } from "@/lib/mock-feed";
import type { AppState, FeedCatalog, RankedArticle, RankingMode, UserProfile } from "@/lib/types";

export function getDefaultProfile(): UserProfile {
  return {
    interests: ["BMW", "Oldtimers", "Sports Cars"],
    eras: ["90s", "Heritage"],
    motorsport: ["WEC"],
    regions: ["Europe", "Japan"],
    followedSources: ["Top Gear", "Hagerty"],
    followedTopics: ["BMW", "Oldtimers", "WEC"],
    mutedTopics: ["SUV gossip"],
    watchlistModels: ["E46 M3", "911 GT3"],
    sourceStyle: "Balanced",
    rankingMode: "Balanced",
  };
}

export function getDefaultState(): AppState {
  return {
    hasCompletedOnboarding: false,
    profile: getDefaultProfile(),
    savedStoryIds: [],
    hiddenStoryIds: [],
    openedStoryIds: [],
    hiddenSourceIds: [],
    currentSurface: "your-lane",
    updatedAt: new Date().toISOString(),
  };
}

function scoreSourceStyle(articleStyle: RankedArticle["sourceStyle"], profile: UserProfile) {
  if (profile.sourceStyle === "Balanced") {
    return 5;
  }

  return profile.sourceStyle === articleStyle ? 10 : 0;
}

function scoreRankingMode(mode: RankingMode, article: RankedArticle) {
  switch (mode) {
    case "Fresh first":
      return Math.round(article.freshnessScore * 18);
    case "Deep cuts":
      return article.sourceStyle === "Enthusiast-led" || article.eventType === "Feature" ? 14 : 0;
    case "Motorsport weekend":
      return article.tags.includes("WEC") || article.tags.includes("Motorsport") ? 25 : 0;
    case "Collector mode":
      return article.tags.includes("Oldtimers") || article.tags.includes("Auctions") ? 24 : 0;
    default:
      return 0;
  }
}

function normalizeModel(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getPersonalizedFeed(
  state: AppState,
  catalog: FeedCatalog = seedFeedCatalog,
): RankedArticle[] {
  const { profile, hiddenStoryIds, hiddenSourceIds, savedStoryIds, openedStoryIds } = state;
  const ranked = catalog.articles
    .filter(
      (article) =>
        !hiddenStoryIds.includes(article.id) &&
        !hiddenSourceIds.includes(article.source) &&
        !article.tags.some((tag) => profile.mutedTopics.includes(tag)),
    )
    .map((article) => {
      const interestMatches = article.tags.filter((tag) =>
        profile.interests.includes(tag) || profile.followedTopics.includes(tag),
      );
      const eraMatches = article.tags.filter((tag) => profile.eras.includes(tag));
      const motorsportMatches = article.tags.filter((tag) => profile.motorsport.includes(tag));
      const regionMatches = article.regions.filter((region) => profile.regions.includes(region));
      const watchlistMatches = profile.watchlistModels.filter((model) =>
        normalizeModel(`${article.title} ${article.summary}`).includes(normalizeModel(model)),
      );
      const sourceBonus = profile.followedSources.includes(article.source) ? 12 : 0;
      const saveBonus = savedStoryIds.includes(article.id) ? 8 : 0;
      const openedBonus = openedStoryIds.includes(article.id) ? 5 : 0;
      const trustBonus = Math.round(article.trustScore * 20);
      const freshnessBonus = Math.round(article.freshnessScore * 15);
      const styleBonus = scoreSourceStyle(article.sourceStyle, profile);
      const imageBonus = article.imageUrl ? 6 : 0;
      const laneSignalCount =
        interestMatches.length +
        eraMatches.length +
        motorsportMatches.length +
        regionMatches.length +
        watchlistMatches.length +
        (profile.followedSources.includes(article.source) ? 1 : 0);

      const baseArticle = {
        ...article,
        score: 0,
        reason: "",
        laneSignalCount,
      };

      const modeBonus = scoreRankingMode(profile.rankingMode, baseArticle);
      const unmatchedPenalty =
        state.hasCompletedOnboarding && laneSignalCount === 0 ? 28 : 0;

      const score =
        interestMatches.length * 22 +
        eraMatches.length * 14 +
        motorsportMatches.length * 18 +
        regionMatches.length * 8 +
        watchlistMatches.length * 26 +
        sourceBonus +
        saveBonus +
        openedBonus +
        trustBonus +
        freshnessBonus +
        styleBonus +
        imageBonus +
        modeBonus -
        unmatchedPenalty;

      const reasonParts = [
        interestMatches[0] ? `Matches ${interestMatches.slice(0, 2).join(" and ")}` : null,
        eraMatches[0] ? `fits your ${eraMatches[0]} preference` : null,
        motorsportMatches[0] ? `tracks your ${motorsportMatches[0]} lane` : null,
        watchlistMatches[0] ? `hits your ${watchlistMatches[0]} watchlist` : null,
        profile.followedSources.includes(article.source) ? `from a followed source` : "trusted source weighting",
      ].filter((value): value is string => Boolean(value));

      return {
        ...baseArticle,
        score,
        reason: `${reasonParts.join(", ")}.`,
      };
    })
    .sort((left, right) => right.score - left.score);

  if (!state.hasCompletedOnboarding) {
    return ranked;
  }

  const focusedLane = ranked.filter(
    (article) => article.laneSignalCount > 0 || article.score >= 58,
  );

  return focusedLane.length >= 8 ? focusedLane : ranked;
}

export function getPolePosition(state: AppState, catalog: FeedCatalog = seedFeedCatalog) {
  return getPersonalizedFeed(state, catalog)
    .filter((article) => article.trustScore >= 0.86)
    .slice(0, 4);
}

export function getRecommendedTopics(
  state: AppState,
  catalog: FeedCatalog = seedFeedCatalog,
) {
  const topStories = getPersonalizedFeed(state, catalog).slice(0, 6);
  const uniqueTopics = new Set<string>();

  for (const story of topStories) {
    for (const tag of story.tags) {
      if (!state.profile.mutedTopics.includes(tag)) {
        uniqueTopics.add(tag);
      }
    }
  }

  return Array.from(uniqueTopics).slice(0, 8);
}

export function getClusterStories(
  clusterId: string,
  state: AppState,
  catalog: FeedCatalog = seedFeedCatalog,
) {
  const cluster = catalog.storyClusters.find((entry) => entry.id === clusterId);

  if (!cluster) {
    return [];
  }

  const ranked = getPersonalizedFeed(state, catalog);
  const map = new Map(ranked.map((story) => [story.id, story]));

  return cluster.storyIds
    .map((storyId) => map.get(storyId))
    .filter((story): story is RankedArticle => Boolean(story));
}
