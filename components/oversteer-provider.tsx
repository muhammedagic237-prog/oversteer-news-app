"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { createOfflineReport } from "@/lib/news-sources";
import { seedFeedCatalog } from "@/lib/mock-feed";
import {
  getDefaultState,
  getPersonalizedFeed,
  getPolePosition,
  getRecommendedTopics,
} from "@/lib/personalization";
import type {
  AppState,
  FeedCatalog,
  FeedPayload,
  FeedSourceReport,
  PersistenceMode,
  RankingMode,
  RemoteSyncStatus,
  SourceStyle,
  StateBootstrapPayload,
  StateSnapshot,
  StorySurface,
  UserProfile,
  Viewer,
} from "@/lib/types";

const STORAGE_KEY = "oversteer.momentum.v2";
const DEVICE_KEY = "oversteer.device-id.v1";

type OversteerContextValue = {
  state: AppState;
  hydrated: boolean;
  catalog: FeedCatalog;
  sourceReports: FeedSourceReport[];
  feedLoading: boolean;
  syncStatus: RemoteSyncStatus;
  remoteSyncEnabled: boolean;
  persistenceMode: PersistenceMode;
  authEnabled: boolean;
  viewer: Viewer | null;
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

function mergeState(candidate?: Partial<AppState> | null): AppState {
  const defaults = getDefaultState();

  return {
    ...defaults,
    ...candidate,
    profile: {
      ...defaults.profile,
      ...candidate?.profile,
    },
    updatedAt: candidate?.updatedAt ?? defaults.updatedAt,
  };
}

function stampState(nextState: AppState): AppState {
  return {
    ...nextState,
    updatedAt: new Date().toISOString(),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return mergeState(action.payload);
    case "completeOnboarding":
      return stampState({
        ...state,
        hasCompletedOnboarding: true,
        profile: action.payload,
      });
    case "toggleSavedStory":
      return stampState({
        ...state,
        savedStoryIds: toggleString(state.savedStoryIds, action.payload),
      });
    case "hideStory":
      if (state.hiddenStoryIds.includes(action.payload)) {
        return state;
      }

      return stampState({
        ...state,
        hiddenStoryIds: [...state.hiddenStoryIds, action.payload],
      });
    case "unhideStory":
      return stampState({
        ...state,
        hiddenStoryIds: state.hiddenStoryIds.filter((storyId) => storyId !== action.payload),
      });
    case "markStoryOpened":
      if (state.openedStoryIds.includes(action.payload)) {
        return state;
      }

      return stampState({
        ...state,
        openedStoryIds: [action.payload, ...state.openedStoryIds].slice(0, 20),
      });
    case "followTopic":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          followedTopics: toggleString(state.profile.followedTopics, action.payload),
          mutedTopics: state.profile.mutedTopics.filter((topic) => topic !== action.payload),
        },
      });
    case "muteTopic":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          mutedTopics: state.profile.mutedTopics.includes(action.payload)
            ? state.profile.mutedTopics
            : [...state.profile.mutedTopics, action.payload],
          followedTopics: state.profile.followedTopics.filter((topic) => topic !== action.payload),
        },
      });
    case "unmuteTopic":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          mutedTopics: state.profile.mutedTopics.filter((topic) => topic !== action.payload),
        },
      });
    case "toggleFollowSource":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          followedSources: toggleString(state.profile.followedSources, action.payload),
        },
      });
    case "hideSource":
      if (state.hiddenSourceIds.includes(action.payload)) {
        return state;
      }

      return stampState({
        ...state,
        hiddenSourceIds: [...state.hiddenSourceIds, action.payload],
        profile: {
          ...state.profile,
          followedSources: state.profile.followedSources.filter(
            (source) => source !== action.payload,
          ),
        },
      });
    case "unhideSource":
      return stampState({
        ...state,
        hiddenSourceIds: state.hiddenSourceIds.filter((source) => source !== action.payload),
      });
    case "toggleWatchlistModel":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          watchlistModels: toggleString(state.profile.watchlistModels, action.payload),
        },
      });
    case "setRankingMode":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          rankingMode: action.payload,
        },
      });
    case "setSourceStyle":
      return stampState({
        ...state,
        profile: {
          ...state.profile,
          sourceStyle: action.payload,
        },
      });
    case "setSurface":
      return stampState({
        ...state,
        currentSurface: action.payload,
      });
    default:
      return state;
  }
}

const OversteerContext = createContext<OversteerContextValue | null>(null);

export function OversteerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [catalog, setCatalog] = useState<FeedCatalog>(seedFeedCatalog);
  const [sourceReports, setSourceReports] = useState<FeedSourceReport[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<RemoteSyncStatus>("disabled");
  const [authEnabled, setAuthEnabled] = useState(false);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [persistenceMode, setPersistenceMode] = useState<PersistenceMode>("disabled");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const pathname = usePathname();

  const loadFeed = useEffectEvent(async () => {
    setFeedLoading(true);

    try {
      const response = await fetch("/api/feed");

      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}.`);
      }

      const payload = (await response.json()) as FeedPayload;

      setCatalog(payload.catalog);
      setSourceReports(payload.reports);
    } catch {
      setCatalog(seedFeedCatalog);
      setSourceReports([
        createOfflineReport("Feed API unavailable. Using the seeded editorial lane."),
      ]);
    } finally {
      setFeedLoading(false);
    }
  });

  const remoteSyncEnabled = persistenceMode !== "disabled";

  const hydrateRemoteState = useEffectEvent(async (resolvedDeviceId: string, localState: AppState) => {
    try {
      const response = await fetch(`/api/state?deviceId=${encodeURIComponent(resolvedDeviceId)}`);

      if (!response.ok) {
        throw new Error(`State request failed with ${response.status}.`);
      }

      const payload = (await response.json()) as StateBootstrapPayload;

      setAuthEnabled(payload.authEnabled);
      setViewer(payload.viewer);
      setPersistenceMode(payload.persistenceMode);

      if (!payload.enabled) {
        setSyncStatus("disabled");
        return;
      }

      if (payload.snapshot) {
        const remoteUpdatedAt = new Date(payload.snapshot.updatedAt).valueOf();
        const localUpdatedAt = new Date(localState.updatedAt).valueOf();

        if (remoteUpdatedAt > localUpdatedAt) {
          dispatch({ type: "hydrate", payload: mergeState(payload.snapshot.state) });
        }
      }

      setSyncStatus("synced");
    } catch {
      setPersistenceMode("disabled");
      setSyncStatus("offline");
    }
  });

  const syncRemoteState = useEffectEvent(async (snapshot: StateSnapshot) => {
    if (!remoteSyncEnabled) {
      return;
    }

    setSyncStatus("syncing");

    try {
      const response = await fetch("/api/state", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(snapshot),
      });

      if (!response.ok) {
        throw new Error(`State sync failed with ${response.status}.`);
      }

      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  });

  useEffect(() => {
    const localState = (() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
          return getDefaultState();
        }

        return mergeState(JSON.parse(raw) as Partial<AppState>);
      } catch {
        return getDefaultState();
      }
    })();

    dispatch({ type: "hydrate", payload: localState });

    const storedDeviceId = window.localStorage.getItem(DEVICE_KEY);
    const resolvedDeviceId = storedDeviceId ?? crypto.randomUUID();

    if (!storedDeviceId) {
      window.localStorage.setItem(DEVICE_KEY, resolvedDeviceId);
    }

    setDeviceId(resolvedDeviceId);
    setHydrated(true);
    void loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (!hydrated || !deviceId) {
      return;
    }

    void hydrateRemoteState(deviceId, state);
  }, [deviceId, hydrated, hydrateRemoteState, pathname]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated || !deviceId || !remoteSyncEnabled) {
      return;
    }

    const timer = window.setTimeout(() => {
      void syncRemoteState({
        deviceId,
        state,
        updatedAt: state.updatedAt,
      });
    }, 900);

    return () => window.clearTimeout(timer);
  }, [deviceId, hydrated, remoteSyncEnabled, state, syncRemoteState]);

  const value = useMemo<OversteerContextValue>(
    () => ({
      state,
      hydrated,
      catalog,
      sourceReports,
      feedLoading,
      syncStatus,
      remoteSyncEnabled,
      persistenceMode,
      authEnabled,
      viewer,
      feed: getPersonalizedFeed(state, catalog),
      polePosition: getPolePosition(state, catalog),
      recommendedTopics: getRecommendedTopics(state, catalog),
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
    [
      catalog,
      authEnabled,
      feedLoading,
      hydrated,
      persistenceMode,
      remoteSyncEnabled,
      sourceReports,
      state,
      syncStatus,
      viewer,
    ],
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
