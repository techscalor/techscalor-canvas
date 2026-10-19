import { createClient } from "@supabase/supabase-js";

/**
 * The site runs on the owner's own Supabase project (not the Lovable-managed one).
 * Override with VITE_APP_SUPABASE_URL / VITE_APP_SUPABASE_PUBLISHABLE_KEY (e.g. in Vercel);
 * otherwise these public defaults are used. The publishable key is safe in browser code.
 */
const DEFAULT_URL = "https://dhmdffdkznouvqvjdhul.supabase.co";
const DEFAULT_KEY = "sb_publishable_YF0L9Ka3ZljfXg-ycltBkA_JpWoJMrG";

const url = (import.meta.env["VITE_APP_SUPABASE_URL"] as string | undefined) || DEFAULT_URL;
const key = (import.meta.env["VITE_APP_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) || DEFAULT_KEY;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "techscalor-auth",
    storage: typeof window === "undefined" ? undefined : window.localStorage,
  },
});

export const PROJECT_BUCKET = "project-images";
