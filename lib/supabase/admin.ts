import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only service-role client. Never expose this client or its key to the browser.
// Enquiry APIs and the public booking-invite flow use it after validating input or
// a hashed single-use token. Admin booking UI must use lib/supabase/server.ts so RLS applies.

let adminClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

export function getSupabaseAdmin() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!rawUrl || !serviceRoleKey) {
    throw new Error("Supabase is not configured");
  }

  const url = normalizeSupabaseUrl(rawUrl);

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}
