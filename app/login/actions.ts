"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-auth";
import { hasPublicSupabaseConfig } from "@/lib/supabase-config";

function redirectWithMessage(path: string, key: "error" | "message", value: string) {
  const params = new URLSearchParams({ [key]: value });

  redirect(`${path}?${params.toString()}`);
}

export async function login(formData: FormData) {
  if (!hasPublicSupabaseConfig()) {
    redirectWithMessage("/login", "error", "Supabase auth is not configured yet.");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/login", "error", "Supabase auth is unavailable.");
    return;
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/account");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage("/login", "error", error.message);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  if (!hasPublicSupabaseConfig()) {
    redirectWithMessage("/login", "error", "Supabase auth is not configured yet.");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/login", "error", "Supabase auth is unavailable.");
    return;
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const headerList = await headers();
  const origin =
    headerList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://127.0.0.1:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    redirectWithMessage("/login", "error", error.message);
  }

  revalidatePath("/", "layout");
  redirectWithMessage("/login", "message", "Check your email to confirm your account.");
}

export async function signout() {
  if (!hasPublicSupabaseConfig()) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirectWithMessage("/login", "message", "Signed out.");
}
