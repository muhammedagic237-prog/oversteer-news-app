import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getDefaultState } from "@/lib/personalization";
import {
  getServiceSupabaseConfig,
  hasPublicSupabaseConfig,
  hasServiceSupabaseConfig,
} from "@/lib/supabase-config";
import type { AppState, FeedPayload, StateSnapshot, Viewer } from "@/lib/types";

const DEVICE_STATE_TABLE = process.env.OVERSTEER_STATE_TABLE ?? "user_state_snapshots";
const FEED_TABLE = process.env.OVERSTEER_FEED_TABLE ?? "feed_snapshots";
const PROFILES_TABLE = process.env.OVERSTEER_PROFILE_TABLE ?? "profiles";
const PREFERENCES_TABLE = process.env.OVERSTEER_PREFERENCES_TABLE ?? "user_preferences";
const SAVED_TABLE = process.env.OVERSTEER_SAVED_TABLE ?? "user_saved_stories";
const HIDDEN_STORIES_TABLE = process.env.OVERSTEER_HIDDEN_STORIES_TABLE ?? "user_hidden_stories";
const OPENED_STORIES_TABLE = process.env.OVERSTEER_OPENED_STORIES_TABLE ?? "user_opened_stories";
const HIDDEN_SOURCES_TABLE = process.env.OVERSTEER_HIDDEN_SOURCES_TABLE ?? "user_hidden_sources";

let cachedAdminClient: SupabaseClient | null = null;

function getAdminClient() {
  const config = getServiceSupabaseConfig();

  if (!config) {
    return null;
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedAdminClient;
}

function fallbackDisplayName(email: string) {
  return email.split("@")[0] ?? email;
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

export function getSupabaseConfigSummary() {
  return {
    authEnabled: hasPublicSupabaseConfig(),
    serviceSyncEnabled: hasServiceSupabaseConfig(),
    stateTable: DEVICE_STATE_TABLE,
    feedTable: FEED_TABLE,
    profileTable: PROFILES_TABLE,
    preferencesTable: PREFERENCES_TABLE,
  };
}

export function isSupabaseEnabled() {
  return hasPublicSupabaseConfig() || hasServiceSupabaseConfig();
}

export function isSupabaseAuthEnabled() {
  return hasPublicSupabaseConfig();
}

export function isSupabaseServiceEnabled() {
  return hasServiceSupabaseConfig();
}

export async function loadDeviceStateSnapshot(deviceId: string) {
  const client = getAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from(DEVICE_STATE_TABLE)
    .select("device_id, payload, updated_at")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    deviceId: data.device_id as string,
    state: mergeState(data.payload as StateSnapshot["state"]),
    updatedAt: (data.updated_at as string) ?? new Date().toISOString(),
  } satisfies StateSnapshot;
}

export async function saveDeviceStateSnapshot(snapshot: StateSnapshot) {
  const client = getAdminClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from(DEVICE_STATE_TABLE).upsert(
    {
      device_id: snapshot.deviceId,
      payload: snapshot.state,
      updated_at: snapshot.updatedAt,
    },
    {
      onConflict: "device_id",
    },
  );

  return !error;
}

export async function loadViewer(userId: string) {
  const client = getAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from(PROFILES_TABLE)
    .select("id, email, display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id as string,
    email: (data.email as string) ?? "",
    displayName: (data.display_name as string | null) ?? null,
    avatarUrl: (data.avatar_url as string | null) ?? null,
  } satisfies Viewer;
}

export async function ensureViewerProfile(viewer: Viewer) {
  const client = getAdminClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from(PROFILES_TABLE).upsert(
    {
      id: viewer.id,
      email: viewer.email,
      display_name: viewer.displayName ?? fallbackDisplayName(viewer.email),
      avatar_url: viewer.avatarUrl ?? null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );

  return !error;
}

export async function loadUserAppState(userId: string) {
  const client = getAdminClient();

  if (!client) {
    return null;
  }

  const [preferencesResult, savedResult, hiddenStoriesResult, openedStoriesResult, hiddenSourcesResult] =
    await Promise.all([
      client
        .from(PREFERENCES_TABLE)
        .select(
          "interests, eras, motorsport, regions, followed_sources, followed_topics, muted_topics, watchlist_models, source_style, ranking_mode, has_completed_onboarding, current_surface, updated_at",
        )
        .eq("user_id", userId)
        .maybeSingle(),
      client.from(SAVED_TABLE).select("story_id").eq("user_id", userId).order("saved_at", { ascending: false }),
      client
        .from(HIDDEN_STORIES_TABLE)
        .select("story_id")
        .eq("user_id", userId)
        .order("hidden_at", { ascending: false }),
      client
        .from(OPENED_STORIES_TABLE)
        .select("story_id")
        .eq("user_id", userId)
        .order("opened_at", { ascending: false })
        .limit(20),
      client
        .from(HIDDEN_SOURCES_TABLE)
        .select("source_id")
        .eq("user_id", userId)
        .order("hidden_at", { ascending: false }),
    ]);

  if (preferencesResult.error) {
    return null;
  }

  const defaults = getDefaultState();
  const preferences = preferencesResult.data;

  return mergeState({
    hasCompletedOnboarding:
      (preferences?.has_completed_onboarding as boolean | undefined) ?? defaults.hasCompletedOnboarding,
    profile: {
      ...defaults.profile,
      interests: (preferences?.interests as string[] | null) ?? defaults.profile.interests,
      eras: (preferences?.eras as string[] | null) ?? defaults.profile.eras,
      motorsport: (preferences?.motorsport as string[] | null) ?? defaults.profile.motorsport,
      regions: (preferences?.regions as string[] | null) ?? defaults.profile.regions,
      followedSources:
        (preferences?.followed_sources as string[] | null) ?? defaults.profile.followedSources,
      followedTopics:
        (preferences?.followed_topics as string[] | null) ?? defaults.profile.followedTopics,
      mutedTopics: (preferences?.muted_topics as string[] | null) ?? defaults.profile.mutedTopics,
      watchlistModels:
        (preferences?.watchlist_models as string[] | null) ?? defaults.profile.watchlistModels,
      sourceStyle:
        (preferences?.source_style as AppState["profile"]["sourceStyle"] | null) ??
        defaults.profile.sourceStyle,
      rankingMode:
        (preferences?.ranking_mode as AppState["profile"]["rankingMode"] | null) ??
        defaults.profile.rankingMode,
    },
    savedStoryIds:
      savedResult.data?.map((entry) => entry.story_id as string).filter(Boolean) ??
      defaults.savedStoryIds,
    hiddenStoryIds:
      hiddenStoriesResult.data?.map((entry) => entry.story_id as string).filter(Boolean) ??
      defaults.hiddenStoryIds,
    openedStoryIds:
      openedStoriesResult.data?.map((entry) => entry.story_id as string).filter(Boolean) ??
      defaults.openedStoryIds,
    hiddenSourceIds:
      hiddenSourcesResult.data?.map((entry) => entry.source_id as string).filter(Boolean) ??
      defaults.hiddenSourceIds,
    currentSurface:
      (preferences?.current_surface as AppState["currentSurface"] | null) ?? defaults.currentSurface,
    updatedAt: (preferences?.updated_at as string | null) ?? defaults.updatedAt,
  });
}

async function replaceRows(
  client: SupabaseClient,
  table: string,
  userId: string,
  column: string,
  values: string[],
  timestampColumn: string,
) {
  const { error: deleteError } = await client.from(table).delete().eq("user_id", userId);

  if (deleteError) {
    return false;
  }

  if (values.length === 0) {
    return true;
  }

  const rows = values.map((value) => ({
    user_id: userId,
    [column]: value,
    [timestampColumn]: new Date().toISOString(),
  }));
  const { error: insertError } = await client.from(table).insert(rows);

  return !insertError;
}

export async function saveUserAppState(viewer: Viewer, state: AppState) {
  const client = getAdminClient();

  if (!client) {
    return false;
  }

  const ensuredProfile = await ensureViewerProfile(viewer);

  if (!ensuredProfile) {
    return false;
  }

  const preferencesPromise = client.from(PREFERENCES_TABLE).upsert(
    {
      user_id: viewer.id,
      interests: state.profile.interests,
      eras: state.profile.eras,
      motorsport: state.profile.motorsport,
      regions: state.profile.regions,
      followed_sources: state.profile.followedSources,
      followed_topics: state.profile.followedTopics,
      muted_topics: state.profile.mutedTopics,
      watchlist_models: state.profile.watchlistModels,
      source_style: state.profile.sourceStyle,
      ranking_mode: state.profile.rankingMode,
      has_completed_onboarding: state.hasCompletedOnboarding,
      current_surface: state.currentSurface,
      updated_at: state.updatedAt,
    },
    {
      onConflict: "user_id",
    },
  );

  const replacements = await Promise.all([
    replaceRows(client, SAVED_TABLE, viewer.id, "story_id", state.savedStoryIds, "saved_at"),
    replaceRows(
      client,
      HIDDEN_STORIES_TABLE,
      viewer.id,
      "story_id",
      state.hiddenStoryIds,
      "hidden_at",
    ),
    replaceRows(
      client,
      OPENED_STORIES_TABLE,
      viewer.id,
      "story_id",
      state.openedStoryIds.slice(0, 20),
      "opened_at",
    ),
    replaceRows(
      client,
      HIDDEN_SOURCES_TABLE,
      viewer.id,
      "source_id",
      state.hiddenSourceIds,
      "hidden_at",
    ),
  ]);

  const { error: preferencesError } = await preferencesPromise;

  return !preferencesError && replacements.every(Boolean);
}

export async function loadFeedPayload() {
  const client = getAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from(FEED_TABLE)
    .select("payload, reports, updated_at")
    .eq("id", "global")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    catalog: data.payload as FeedPayload["catalog"],
    reports: (data.reports as FeedPayload["reports"]) ?? [],
  } satisfies FeedPayload;
}

export async function saveFeedPayload(payload: FeedPayload) {
  const client = getAdminClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from(FEED_TABLE).upsert(
    {
      id: "global",
      payload: payload.catalog,
      reports: payload.reports,
      updated_at: payload.catalog.syncedAt,
    },
    {
      onConflict: "id",
    },
  );

  return !error;
}
