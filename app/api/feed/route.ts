import { NextResponse } from "next/server";

import { getFeedPayload } from "@/lib/news-ingestion";

export const runtime = "nodejs";

export async function GET() {
  const payload = await getFeedPayload();

  return NextResponse.json(payload, {
    headers: {
      "cache-control": `s-maxage=${Number(process.env.OVERSTEER_FEED_REVALIDATE_SECONDS ?? 900)}, stale-while-revalidate=300`,
    },
  });
}
