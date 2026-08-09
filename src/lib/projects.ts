import { supabase, PROJECT_BUCKET } from "./supabase";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string | null;
  client_name: string | null;
  client_country: string | null;
  project_date: string | null;
  languages: string[];
  live_url: string | null;
  feature_image: string | null;
  images: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
};

export async function fetchProjects(opts?: { includeUnpublished?: boolean }) {
  let q = supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (!opts?.includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Project[];
}

/** Public URL for a stored image. Accepts a storage path or a full URL. */
export function imageUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//.test(pathOrUrl) || pathOrUrl.startsWith("/")) return pathOrUrl;
  return supabase.storage.from(PROJECT_BUCKET).getPublicUrl(pathOrUrl).data.publicUrl;
}

/**
 * Downscale + convert to WebP in the browser before upload.
 * Keeps stored files small so they load fast from the CDN.
 */
export async function optimizeImage(file: File, maxWidth = 1600, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
    bitmap.close();
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadProjectImage(file: File) {
  const blob = await optimizeImage(file);
  const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PROJECT_BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type || file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}
