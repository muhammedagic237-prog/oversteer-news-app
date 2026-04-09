"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  getDefaultState,
  getPersonalizedFeed,
  getPolePosition,
  getRecommendedTopics,
} from "@/lib/personalization";
import type {
  AppState,
  RankingMode,
  SourceStyle,
  StorySurface,
  UserProfile,
} from "@/lib/types";

const STORAGE_KEY = "oversteer.momentum.v1";

type OversteerContextValue = {
  state: AppState;
  hydrated: boolean;
  feed: ReturnType<typeof getPersonalizedFeed>;
  polePosition: ReturnType<typeof getPolePosition>;
  recommendedTopics: string[];
  completeOnboarding: (profile: UserProfile) => void;
  toggleSavedStory: (storyId: string) => void;
  hideStory: (storyId: string) => void;
  unhideStory: (storyId: string) => void;
  markStoryOpened: (storyId: string) => void;
  followTopic: (topic: string) => void;
  muteTopic: (topic: string) => void;
  unmuteTopic: (topic: string) => void;
  toggleFollowSource: (source: string) => void;
  hideSource: (source: string) => void;
  unhideSource: (source: string) => void;
  toggleWatchlistModel: (model: string) => void;
  setRankingMode: (mode: RankingMode) => void;
  setSourceStyle: (style: SourceStyle) => void;
  setSurface: (surface: StorySurface) => void;
};

type Action =
  | { type: "hydrate"; payload: AppState }
  | { type: "completeOnboarding"; payload: UserProfile }
  | { type: "toggleSavedStory"; payload: string }
  | { type: "hideStory"; payload: string }
  | { type: "unhideStory"; payload: string }
  | { type: "markStoryOpened"; payload: string }
  | { type: "followTopic"; payload: string }
  | { type: "muteTopic"; payload: string }
  | { type: "unmuteTopic"; payload: string }
  | { type: "toggleFollowSource"; payload: string }
  | { type: "hideSource"; payload: string }
  | { type: "unhideSource"; payload: string }
  | { type: "toggleWatchlistModel"; payload: string }
  | { type: "setRankingMode"; payload: RankingMode }
  | { type: "setSourceStyle"; payload: SourceStyle }
  | { type: "setSurface"; payload: StorySurface };

function toggleString(values: string[], target: string) {
  return values.includes(target)
    ? values.filter((value) => value !== target)
    : [...values, target];
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "completeOnboarding":
      return {
        ...state,
        hasCompletedOnboarding: true,
        profile: action.payload,
      };
    case "toggleSavedStory":
      return {
        ...state,
        savedStoryIds: toggleString(state.savedStoryIds, action.payload),
      };
    case "hideStory":
      if (state.hiddenStoryIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        hiddenStoryIds: [...state.hiddenStoryIds, action.payload],
      };
    case "unhideStory":
      return {
        ...state,
        hiddenStoryIds: state.hiddenStoryIds.filter((storyId) => storyId !== action.payload),
      };
    case "markStoryOpened":
      if (state.openedStoryIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        openedStoryIds: [action.payload, ...state.openedStoryIds].slice(0, 20),
      };
    case "followTopic":
      return {
        ...state,
        profile: {
          ...state.profile,
          followedTopics: toggleString(state.profile.followedTopics, action.payload),
          mutedTopics: state.profile.mutedTopics.filter((topic) => topic !== action.payload),
        },
      };
    case "muteTopic":
      return {
        ...state,
        profile: {
          ...state.profile,
          mutedTopics: state.profile.mutedTopics.includes(action.payload)
            ? state.profile.mutedTopics
            : [...state.profile.mutedTopics, action.payload],
          followedTopics: state.profile.followedTopics.filter((topic) => topic !== action.payload),
        },
      };
    case "unmuteTopic":
      return {
        ...state,
        profile: {
          ...state.profile,
          mutedTopics: state.profile.mutedTopics.filter((topic) => topic !== action.payload),
        },
      };
    case "toggleFollowSource":
      return {
        ...state,
        profile: {
          ...state.profile,
          followedSources: toggleString(state.profile.followedSources, action.payload),
        },
      };
    case "hideSource":
      if (state.hiddenSourceIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        hiddenSourceIds: [...state.hiddenSourceIds, action.payload],
        profile: {
          ...state.profile,
          followedSources: state.profile.followedSources.filter(
            (source) => source !== action.payload,
          ),
        },
      };
    case "unhideSource":
      return {
        ...state,
        hiddenSourceIds: state.hiddenSourceIds.filter((source) => source !== action.payload),
      };
    case "toggleWatchlistModel":
      return {
        ...state,
        profile: {
          ...state.profile,
          watchlistModels: toggleString(state.profile.watchlistModels, action.payload),
        },
      };
    case "setRankingMode":
      return {
        ...state,
        profile: {
          ...state.profile,
          rankingMode: action.payload,
        },
      };
    case "setSourceStyle":
      return {
        ...state,
        profile: {
          ...state.profile,
          sourceStyle: action.payload,
        },
      };
    case "setSurface":
      return {
        ...state,
        currentSurface: action.payload,
      };
    default:
      return state;
  }
}

const OversteerContext = createContext<OversteerContextValue | null>(null);

export function OversteerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getDefaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        const defaults = getDefaultState();

        dispatch({
          type: "hydrate",
          payload: {
            ...defaults,
            ...parsed,
            profile: {
              ...defaults.profile,
              ...parsed.profile,
            },
          } as AppState,
        });
      }
    } catch {
      // Ignore invalid local state and fall back to defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<OversteerContextValue>(
    () => ({
      state,
      hydrated,
      feed: getPersonalizedFeed(state),
      polePosition: getPolePosition(state),
      recommendedTopics: getRecommendedTopics(state),
      completeOnboarding: (profile) =>
        dispatch({ type: "completeOnboarding", payload: profile }),
      toggleSavedStory: (storyId) =>
        dispatch({ type: "toggleSavedStory", payload: storyId }),
      hideStory: (storyId) => dispatch({ type: "hideStory", payload: storyId }),
      unhideStory: (storyId) => dispatch({ type: "unhideStory", payload: storyId }),
      markStoryOpened: (storyId) =>
        dispatch({ type: "markStoryOpened", payload: storyId }),
      followTopic: (topic) => dispatch({ type: "followTopic", payload: topic }),
      muteTopic: (topic) => dispatch({ type: "muteTopic", payload: topic }),
      unmuteTopic: (topic) => dispatch({ type: "unmuteTopic", payload: topic }),
      toggleFollowSource: (source) =>
        dispatch({ type: "toggleFollowSource", payload: source }),
      hideSource: (source) => dispatch({ type: "hideSource", payload: source }),
      unhideSource: (source) => dispatch({ type: "unhideSource", payload: source }),
      toggleWatchlistModel: (model) =>
        dispatch({ type: "toggleWatchlistModel", payload: model }),
      setRankingMode: (mode) => dispatch({ type: "setRankingMode", payload: mode }),
      setSourceStyle: (style) => dispatch({ type: "setSourceStyle", payload: style }),
      setSurface: (surface) => dispatch({ type: "setSurface", payload: surface }),
    }),
    [hydrated, state],
  );

  return <OversteerContext.Provider value={value}>{children}</OversteerContext.Provider>;
}

export function useOversteer() {
  const context = useContext(OversteerContext);

  if (!context) {
    throw new Error("useOversteer must be used inside OversteerProvider.");
  }

  return context;
}
