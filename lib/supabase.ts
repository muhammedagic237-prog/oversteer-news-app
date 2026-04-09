import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { FeedPayload, StateSnapshot } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STATE_TABLE = process.env.OVERSTEER_STATE_TABLE ?? "user_state_snapshots";
const FEED_TABLE = process.env.OVERSTEER_FEED_TABLE ?? "feed_snapshots";

let cachedClient: SupabaseClient | null = null;

function getSupabaseServerClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedClient;
}

export function isSupabaseEnabled() {
  return Boolean(getSupabaseServerClient());
}

export function getSupabaseConfigSummary() {
  return {
    enabled: isSupabaseEnabled(),
    stateTable: STATE_TABLE,
    feedTable: FEED_TABLE,
  };
}

export async function loadStateSnapshot(deviceId: string) {
  const client = getSupabaseServerClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from(STATE_TABLE)
    .select("device_id, payload, updated_at")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    deviceId: data.device_id as string,
    state: data.payload as StateSnapshot["state"],
    updatedAt: (data.updated_at as string) ?? new Date().toISOString(),
  } satisfies StateSnapshot;
}

export async function saveStateSnapshot(snapshot: StateSnapshot) {
  const client = getSupabaseServerClient();

  if (!client) {
    return false;
  }

  const { error } = await client.from(STATE_TABLE).upsert(
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

export async function loadFeedPayload() {
  const client = getSupabaseServerClient();

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
  const client = getSupabaseServerClient();

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
