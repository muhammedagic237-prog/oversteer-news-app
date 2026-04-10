import { NextResponse } from "next/server";

import { getDefaultState } from "@/lib/personalization";
import { createSupabaseServerClient } from "@/lib/supabase-auth";
import {
  isSupabaseAuthEnabled,
  isSupabaseServiceEnabled,
  loadDeviceStateSnapshot,
  loadUserAppState,
  loadViewer,
  saveDeviceStateSnapshot,
  saveUserAppState,
} from "@/lib/supabase";
import type { AppState, StateBootstrapPayload, StateSnapshot, Viewer } from "@/lib/types";

export const runtime = "nodejs";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AppState>;
  const defaults = getDefaultState();

  return (
    typeof candidate.hasCompletedOnboarding === "boolean" &&
    candidate.profile !== undefined &&
    typeof candidate.profile === "object" &&
    isStringArray(candidate.savedStoryIds) &&
    isStringArray(candidate.hiddenStoryIds) &&
    isStringArray(candidate.openedStoryIds) &&
    isStringArray(candidate.hiddenSourceIds) &&
    typeof candidate.currentSurface === "string" &&
    typeof candidate.updatedAt === "string" &&
    isStringArray((candidate.profile as AppState["profile"]).interests ?? defaults.profile.interests) &&
    isStringArray((candidate.profile as AppState["profile"]).eras ?? defaults.profile.eras) &&
    isStringArray((candidate.profile as AppState["profile"]).motorsport ?? defaults.profile.motorsport) &&
    isStringArray((candidate.profile as AppState["profile"]).regions ?? defaults.profile.regions) &&
    isStringArray((candidate.profile as AppState["profile"]).followedSources ?? defaults.profile.followedSources) &&
    isStringArray((candidate.profile as AppState["profile"]).followedTopics ?? defaults.profile.followedTopics) &&
    isStringArray((candidate.profile as AppState["profile"]).mutedTopics ?? defaults.profile.mutedTopics) &&
    isStringArray((candidate.profile as AppState["profile"]).watchlistModels ?? defaults.profile.watchlistModels)
  );
}

async function getAuthenticatedViewer() {
  if (!isSupabaseAuthEnabled()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const storedViewer = await loadViewer(user.id);

  return (
    storedViewer ?? {
      id: user.id,
      email: user.email,
      displayName: (user.user_metadata?.display_name as string | undefined) ?? null,
      avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    }
  ) satisfies Viewer;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");
  const authEnabled = isSupabaseAuthEnabled();
  const viewer = await getAuthenticatedViewer();

  if (viewer && isSupabaseServiceEnabled()) {
    const state = await loadUserAppState(viewer.id);

    return NextResponse.json({
      enabled: true,
      authEnabled,
      persistenceMode: "account",
      snapshot: state
        ? {
            deviceId: `account:${viewer.id}`,
            state,
            updatedAt: state.updatedAt,
          }
        : null,
      viewer,
    } satisfies StateBootstrapPayload);
  }

  if (deviceId && isSupabaseServiceEnabled()) {
    const snapshot = await loadDeviceStateSnapshot(deviceId);

    return NextResponse.json({
      enabled: true,
      authEnabled,
      persistenceMode: "device",
      snapshot,
      viewer,
    } satisfies StateBootstrapPayload);
  }

  return NextResponse.json({
    enabled: false,
    authEnabled,
    persistenceMode: "disabled",
    snapshot: null,
    viewer,
  } satisfies StateBootstrapPayload);
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<StateSnapshot> | null;

  if (!body?.deviceId || !isAppState(body.state)) {
    return NextResponse.json({ error: "Invalid state payload." }, { status: 400 });
  }

  const viewer = await getAuthenticatedViewer();

  if (viewer && isSupabaseServiceEnabled()) {
    const saved = await saveUserAppState(viewer, body.state);

    if (!saved) {
      return NextResponse.json({ enabled: true, saved: false }, { status: 500 });
    }

    return NextResponse.json({
      enabled: true,
      saved: true,
      persistenceMode: "account",
      viewer,
    });
  }

  if (!isSupabaseServiceEnabled()) {
    return NextResponse.json({
      enabled: false,
      saved: false,
      persistenceMode: "disabled",
      viewer,
    });
  }

  const snapshot = {
    deviceId: body.deviceId,
    state: body.state,
    updatedAt: body.updatedAt ?? body.state.updatedAt,
  } satisfies StateSnapshot;

  const saved = await saveDeviceStateSnapshot(snapshot);

  if (!saved) {
    return NextResponse.json({ enabled: true, saved: false }, { status: 500 });
  }

  return NextResponse.json({
    enabled: true,
    saved: true,
    persistenceMode: "device",
    viewer,
  });
}
