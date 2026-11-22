"use client";

import { createClient } from "@supabase/supabase-js";

// पूरे ऐप में एक ही Supabase connection
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// URL में आई Login की गलती पढ़ें (?error=... या #error=...)
export function readAuthError() {
  if (typeof window === "undefined") return "";
  const q = new URLSearchParams(window.location.search);
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const msg = q.get("error_description") || h.get("error_description") || q.get("error") || h.get("error");
  return msg ? decodeURIComponent(msg.replace(/\+/g, " ")) : "";
}
