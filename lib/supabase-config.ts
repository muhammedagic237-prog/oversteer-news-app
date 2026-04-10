type PublicSupabaseConfig = {
  url: string;
  publishableKey: string;
};

type ServiceSupabaseConfig = PublicSupabaseConfig & {
  serviceRoleKey: string;
};

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getServiceSupabaseConfig(): ServiceSupabaseConfig | null {
  const publicConfig = getPublicSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicConfig || !serviceRoleKey) {
    return null;
  }

  return {
    ...publicConfig,
    serviceRoleKey,
  };
}

export function hasPublicSupabaseConfig() {
  return Boolean(getPublicSupabaseConfig());
}

export function hasServiceSupabaseConfig() {
  return Boolean(getServiceSupabaseConfig());
}
