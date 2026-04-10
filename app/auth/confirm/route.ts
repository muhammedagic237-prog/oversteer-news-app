import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/account";
  const redirectTo = request.nextUrl.clone();

  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (!tokenHash || !type) {
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Missing email confirmation token.");

    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "Supabase auth is unavailable.");

    return NextResponse.redirect(redirectTo);
  }

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", error.message);

    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = next;
  redirectTo.searchParams.set("message", "Account confirmed.");

  return NextResponse.redirect(redirectTo);
}
