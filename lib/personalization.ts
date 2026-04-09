import { mockArticles } from "@/lib/mock-feed";
import type { RankedArticle, UserProfile } from "@/lib/types";

export function getDefaultProfile(): UserProfile {
  return {
    interests: ["BMW", "Oldtimers", "Sports Cars"],
    regions: ["Europe", "Japan"],
    followedSources: ["Top Gear", "Hagerty"],
    mutedTopics: ["SUV gossip"],
    sourceStyle: "Balanced",
  };
}

function scoreSourceStyle(articleStyle: RankedArticle["sourceStyle"], profile: UserProfile) {
  if (profile.sourceStyle === "Balanced") {
    return 5;
  }

  return profile.sourceStyle === articleStyle ? 10 : 0;
}

export function getPersonalizedFeed(profile: UserProfile): RankedArticle[] {
  return mockArticles
    .map((article) => {
      const interestMatches = article.tags.filter((tag) => profile.interests.includes(tag));
      const regionMatches = article.regions.filter((region) => profile.regions.includes(region));
      const sourceBonus = profile.followedSources.includes(article.source) ? 10 : 0;
      const mutedPenalty = article.tags.some((tag) => profile.mutedTopics.includes(tag)) ? -100 : 0;
      const trustBonus = Math.round(article.trustScore * 20);
      const freshnessBonus = Math.round(article.freshnessScore * 15);
      const styleBonus = scoreSourceStyle(article.sourceStyle, profile);
      const score =
        interestMatches.length * 25 +
        regionMatches.length * 10 +
        sourceBonus +
        trustBonus +
        freshnessBonus +
        styleBonus +
        mutedPenalty;

      const primaryReason =
        interestMatches.length > 0
          ? `Matches ${interestMatches.join(", ")} and comes from a trusted source.`
          : `Fresh story from ${article.source} with strong trust weighting.`;

      return {
        ...article,
        score,
        reason: primaryReason,
      };
    })
    .sort((left, right) => right.score - left.score);
}
