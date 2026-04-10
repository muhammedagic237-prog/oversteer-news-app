"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useRef,
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
import { detectRuntimeShell } from "@/lib/runtime-shell";
import type {
  AppState,
  FeedCatalog,
  FeedPayload,
  FeedSourceReport,
  PersistenceMode,
  RankingMode,
  RemoteSyncStatus,
  RuntimeShell,
  SourceStyle,
  StateBootstrapPayload,
  StateSnapshot,
  StorySurface,
  UserProfile,
  Viewer,
} from "@/lib/types";

const STORAGE_KEY = "oversteer.momentum.v2";
const FEED_CACHE_KEY = "oversteer.feed-cache.v1";
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
  runtimeShell: RuntimeShell;
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

function readLocalJson<T>(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures and keep the in-memory session moving.
  }
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
  const [runtimeShell, setRuntimeShell] = useState<RuntimeShell>(detectRuntimeShell());
  const lastForegroundRefreshAt = useRef(0);
  const stateRef = useRef(state);
  const pathname = usePathname();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loadFeed = useEffectEvent(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setFeedLoading(true);
    }

    try {
      const response = await fetch("/api/feed", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}.`);
      }

      const payload = (await response.json()) as FeedPayload;

      startTransition(() => {
        setCatalog(payload.catalog);
        setSourceReports(payload.reports);
      });
      writeLocalJson(FEED_CACHE_KEY, payload);
    } catch {
      const cachedFeed = readLocalJson<FeedPayload>(FEED_CACHE_KEY);

      if (cachedFeed?.catalog?.articles?.length) {
        startTransition(() => {
          setCatalog(cachedFeed.catalog);
          setSourceReports(
            cachedFeed.reports.length > 0
              ? cachedFeed.reports
              : [createOfflineReport("Feed API unavailable. Using the last cached editorial lane.")],
          );
        });
      } else {
        startTransition(() => {
          setCatalog(seedFeedCatalog);
          setSourceReports([
            createOfflineReport("Feed API unavailable. Using the seeded editorial lane."),
          ]);
        });
      }
    } finally {
      setFeedLoading(false);
    }
  });

  const remoteSyncEnabled = persistenceMode !== "disabled";

  const hydrateRemoteState = useEffectEvent(
    async (resolvedDeviceId: string, options?: { silent?: boolean }) => {
      try {
        const response = await fetch(`/api/state?deviceId=${encodeURIComponent(resolvedDeviceId)}`, {
          cache: "no-store",
        });

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
          const remoteSnapshot = payload.snapshot;
          const remoteUpdatedAt = new Date(remoteSnapshot.updatedAt).valueOf();
          const localUpdatedAt = new Date(stateRef.current.updatedAt).valueOf();

          if (remoteUpdatedAt > localUpdatedAt) {
            startTransition(() => {
              dispatch({ type: "hydrate", payload: mergeState(remoteSnapshot.state) });
            });
          }
        }

        setSyncStatus("synced");
      } catch {
        if (!options?.silent) {
          setPersistenceMode("disabled");
        }

        setSyncStatus((current) => (current === "disabled" ? current : "offline"));
      }
    },
  );

  const syncRemoteState = useEffectEvent(
    async (snapshot: StateSnapshot, options?: { silent?: boolean; keepalive?: boolean }) => {
      if (!remoteSyncEnabled) {
        return;
      }

      if (!options?.silent) {
        setSyncStatus("syncing");
      }

      try {
        const response = await fetch("/api/state", {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(snapshot),
          keepalive: options?.keepalive,
        });

        if (!response.ok) {
          throw new Error(`State sync failed with ${response.status}.`);
        }

        const payload = (await response.json().catch(() => null)) as
          | { enabled?: boolean; persistenceMode?: PersistenceMode; viewer?: Viewer | null }
          | null;

        if (payload?.persistenceMode) {
          setPersistenceMode(payload.persistenceMode);
        }

        if (payload?.viewer !== undefined) {
          setViewer(payload.viewer);
        }

        if (payload?.enabled === false) {
          setSyncStatus("disabled");
          return;
        }

        setSyncStatus("synced");
      } catch {
        setSyncStatus((current) => {
          if (current === "disabled") {
            return current;
          }

          return options?.silent ? "offline" : "error";
        });
      }
    },
  );

  const flushRemoteSnapshot = useEffectEvent(async (options?: { keepalive?: boolean }) => {
    if (!hydrated || !deviceId || !remoteSyncEnabled) {
      return;
    }

    await syncRemoteState(
      {
        deviceId,
        state: stateRef.current,
        updatedAt: stateRef.current.updatedAt,
      },
      {
        silent: true,
        keepalive: options?.keepalive,
      },
    );
  });

  const refreshForegroundState = useEffectEvent(async () => {
    setRuntimeShell(detectRuntimeShell());

    const now = Date.now();

    if (now - lastForegroundRefreshAt.current < 15000) {
      return;
    }

    lastForegroundRefreshAt.current = now;

    await loadFeed({ silent: true });

    if (deviceId) {
      await hydrateRemoteState(deviceId, { silent: true });
    }
  });

  useEffect(() => {
    const localState = mergeState(readLocalJson<Partial<AppState>>(STORAGE_KEY));
    const cachedFeed = readLocalJson<FeedPayload>(FEED_CACHE_KEY);
    const storedDeviceId = window.localStorage.getItem(DEVICE_KEY);
    const resolvedDeviceId = storedDeviceId ?? crypto.randomUUID();

    if (!storedDeviceId) {
      window.localStorage.setItem(DEVICE_KEY, resolvedDeviceId);
    }

    startTransition(() => {
      dispatch({ type: "hydrate", payload: localState });

      if (cachedFeed?.catalog?.articles?.length) {
        setCatalog(cachedFeed.catalog);
        setSourceReports(cachedFeed.reports);
      }

      setRuntimeShell(detectRuntimeShell());
    });

    setDeviceId(resolvedDeviceId);
    setHydrated(true);
    void loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (!hydrated || !deviceId) {
      return;
    }

    void hydrateRemoteState(deviceId);
  }, [deviceId, hydrated, hydrateRemoteState, pathname]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeLocalJson(STORAGE_KEY, state);
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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeLocalJson(FEED_CACHE_KEY, {
      catalog,
      reports: sourceReports,
    } satisfies FeedPayload);
  }, [catalog, hydrated, sourceReports]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      const { newValue } = event;

      if (event.storageArea !== window.localStorage || !newValue) {
        return;
      }

      if (event.key === STORAGE_KEY) {
        try {
          startTransition(() => {
            dispatch({ type: "hydrate", payload: mergeState(JSON.parse(newValue)) });
          });
        } catch {
          // Ignore malformed external state writes.
        }
      }

      if (event.key === FEED_CACHE_KEY) {
        try {
          const payload = JSON.parse(newValue) as FeedPayload;

          if (payload.catalog?.articles?.length) {
            startTransition(() => {
              setCatalog(payload.catalog);
              setSourceReports(payload.reports);
            });
          }
        } catch {
          // Ignore malformed external feed cache writes.
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const handleVisibleChange = () => {
      if (document.visibilityState === "visible") {
        void refreshForegroundState();
        return;
      }

      void flushRemoteSnapshot({ keepalive: true });
    };

    const handleForeground = () => {
      void refreshForegroundState();
    };

    const handlePageHide = () => {
      void flushRemoteSnapshot({ keepalive: true });
    };

    window.addEventListener("pageshow", handleForeground);
    window.addEventListener("focus", handleForeground);
    window.addEventListener("online", handleForeground);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibleChange);

    return () => {
      window.removeEventListener("pageshow", handleForeground);
      window.removeEventListener("focus", handleForeground);
      window.removeEventListener("online", handleForeground);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibleChange);
    };
  }, [flushRemoteSnapshot, hydrated, refreshForegroundState]);

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
      runtimeShell,
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
      authEnabled,
      catalog,
      feedLoading,
      hydrated,
      persistenceMode,
      remoteSyncEnabled,
      runtimeShell,
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
