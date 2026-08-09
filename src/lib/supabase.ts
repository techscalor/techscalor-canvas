import { createClient } from "@supabase/supabase-js";

const url = import.meta.env['VITE_SUPABASE_URL'] as string;
const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string;

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window === "undefined" ? undefined : window.localStorage,
  },
});

export const PROJECT_BUCKET = "project-images";
