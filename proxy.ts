import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// This Next.js renamed Middleware to Proxy. Runs on every matched request to
// refresh the Supabase auth session before Server Components read it.
export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
