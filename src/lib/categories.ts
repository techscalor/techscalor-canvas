import { supabase } from "./supabase";

export type Category = {
  id: string;
  name: string;
  enabled: boolean;
  sort_order: number;
  created_at: string;
};

export async function fetchCategories(opts?: { includeDisabled?: boolean }) {
  let q = supabase.from("categories").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (!opts?.includeDisabled) q = q.eq("enabled", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Category[];
}
