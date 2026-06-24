import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Privileged Supabase client using the service-role key. Bypasses RLS, so it
 * MUST only ever be used in server code behind an admin check (see requireAdmin).
 * Used for product-image uploads to Storage.
 */
export function createAdminClient() {
  // Defend against a malformed env value (trailing newline, accidental
  // duplication, surrounding quotes). A JWT contains no whitespace, so the
  // first whitespace-delimited token is the real key.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    .replace(/^["']|["']$/g, "")
    .split(/\s+/)[0];
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — image upload is unavailable."
    );
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export const PRODUCT_IMAGE_BUCKET = "product-images";
