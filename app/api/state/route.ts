import { NextResponse } from "next/server";

import { getDefaultState } from "@/lib/personalization";
import { isSupabaseEnabled, loadStateSnapshot, saveStateSnapshot } from "@/lib/supabase";
import type { AppState, StateSnapshot } from "@/lib/types";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");

  if (!deviceId) {
    return NextResponse.json({ error: "Missing deviceId." }, { status: 400 });
  }

  if (!isSupabaseEnabled()) {
    return NextResponse.json({ enabled: false, snapshot: null });
  }

  const snapshot = await loadStateSnapshot(deviceId);

  return NextResponse.json({ enabled: true, snapshot });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<StateSnapshot> | null;

  if (!body?.deviceId || !isAppState(body.state)) {
    return NextResponse.json({ error: "Invalid state payload." }, { status: 400 });
  }

  if (!isSupabaseEnabled()) {
    return NextResponse.json({ enabled: false }, { status: 503 });
  }

  const snapshot = {
    deviceId: body.deviceId,
    state: body.state,
    updatedAt: body.updatedAt ?? body.state.updatedAt,
  } satisfies StateSnapshot;

  const saved = await saveStateSnapshot(snapshot);

  if (!saved) {
    return NextResponse.json({ enabled: true, saved: false }, { status: 500 });
  }

  return NextResponse.json({ enabled: true, saved: true });
}
