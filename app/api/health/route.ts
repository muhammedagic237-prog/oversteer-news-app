import { NextResponse } from "next/server";

import { getSupabaseConfigSummary } from "@/lib/supabase";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    status: "ok",
    now: new Date().toISOString(),
    supabase: getSupabaseConfigSummary(),
  });
}
