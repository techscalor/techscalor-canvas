import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, LogOut, X, Upload, Mail, Users, Tags } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { fetchProjects, imageUrl, uploadProjectImage, CONTRIBUTION_OPTIONS, STATUS_OPTIONS, type Project } from "@/lib/projects";
import { fetchCategories, type Category } from "@/lib/categories";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — TechScalor" },
      { name: "description", content: "Manage TechScalor projects, contact messages and newsletter subscribers." },
      { property: "og:title", content: "Admin — TechScalor" },
      { property: "og:description", content: "Manage projects and leads." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id?: string;
  title: string;
  category: string;
  status: string;
  contributions: string[];
  description: string;
  author: string;
  client_name: string;
  client_country: string;
  project_date: string;
  languages: string;
  live_url: string;
  feature_image: string;
  images: string[];
  published: boolean;
  sort_order: number;
};

const empty: FormState = {
  title: "",
  category: "",
  status: "",
  contributions: [],
  description: "",
  author: "",
  client_name: "",
  client_country: "",
  project_date: "",
  languages: "",
  live_url: "",
  feature_image: "",
  images: [],
  published: true,
  sort_order: 0,
};

const input =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const label = "mb-1.5 block text-sm font-medium text-foreground";

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"projects" | "categories" | "messages" | "subscribers">("projects");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account role is <strong>user</strong>. Set it to <strong>admin</strong> in the
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5">user_roles</code> table, then reload.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => void signOut()} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Sign out</button>
            <Link to="/" className="rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white">Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TechScalor" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-bold text-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user?.email}</span>
            <button
              onClick={() => void signOut().then(() => navigate({ to: "/auth" }))}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-4 pb-2 sm:px-6">
          {([
            ["projects", "Projects", Plus],
            ["categories", "Categories", Tags],
            ["messages", "Messages", Mail],
            ["subscribers", "Subscribers", Users],
          ] as const).map(([k, lbl, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === k ? "bg-gradient-brand text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {lbl}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "projects" && <ProjectsAdmin />}
        {tab === "categories" && <CategoriesAdmin />}
        {tab === "messages" && <SimpleTable table="contact_messages" columns={["created_at", "name", "email", "company", "budget", "message"]} />}
        {tab === "subscribers" && <SimpleTable table="newsletter_subscribers" columns={["created_at", "email"]} />}
      </main>
    </div>
  );
}

function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [busy, setBusy] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      setItems(await fetchProjects({ includeUnpublished: true }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    void load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => setForm({ ...empty })}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No projects yet — add your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[16/10] bg-muted">
                {p.feature_image && (
                  <img src={imageUrl(p.feature_image)} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-semibold text-foreground">{p.title}</h3>
                  {!p.published && <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Draft</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.category} · {p.images.length} images</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      setForm({
                        id: p.id,
                        title: p.title,
                        category: p.category,
                        status: p.status ?? "",
                        contributions: p.contributions ?? [],
                        description: p.description,
                        author: p.author ?? "",
                        client_name: p.client_name ?? "",
                        client_country: p.client_country ?? "",
                        project_date: p.project_date ?? "",
                        languages: p.languages.join(", "),
                        live_url: p.live_url ?? "",
                        feature_image: p.feature_image ?? "",
                        images: p.images,
                        published: p.published,
                        sort_order: p.sort_order,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => void remove(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <ProjectForm
          value={form}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function ProjectForm({ value, onClose, onSaved }: { value: FormState; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<FormState>(value);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  const handleUpload = async (files: FileList | null, target: "feature" | "gallery") => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) paths.push(await uploadProjectImage(file));
      if (target === "feature") set("feature_image", paths[0]!);
      else setF((p) => ({ ...p, images: [...p.images, ...paths] }));
      toast.success(`${paths.length} image(s) uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      title: f.title.trim().slice(0, 200),
      category: f.category.trim() || "Web",
      description: f.description.trim().slice(0, 4000),
      author: f.author.trim() || null,
      client_name: f.client_name.trim() || null,
      client_country: f.client_country.trim() || null,
      project_date: f.project_date || null,
      languages: f.languages.split(",").map((s) => s.trim()).filter(Boolean),
      live_url: f.live_url.trim() || null,
      feature_image: f.feature_image || null,
      images: f.images,
      published: f.published,
      sort_order: Number(f.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    const { error } = f.id
      ? await supabase.from("projects").update(payload).eq("id", f.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(f.id ? "Project updated" : "Project created");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
        className="mx-auto my-8 w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{f.id ? "Edit project" : "New project"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="p-title">Title *</label>
            <input id="p-title" className={input} value={f.title} maxLength={200} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div>
            <label className={label} htmlFor="p-cat">Category (platform)</label>
            <select id="p-cat" className={input} value={f.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Select category…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.name}>{c.name}{c.enabled ? "" : " (hidden)"}</option>
              ))}
              {f.category && !cats.some((c) => c.name === f.category) && <option value={f.category}>{f.category}</option>}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="p-status">Status</label>
            <select id="p-status" className={input} value={f.status} onChange={(e) => set("status", e.target.value)}>
              <option value="">No status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <span className={label}>Contributions (TechScalor's role)</span>
            <div className="flex flex-wrap gap-2">
              {CONTRIBUTION_OPTIONS.map((c) => {
                const on = f.contributions.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setF((p) => ({
                        ...p,
                        contributions: on ? p.contributions.filter((x) => x !== c) : [...p.contributions, c],
                      }))
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on ? "border-transparent bg-gradient-brand text-white" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={label} htmlFor="p-date">Date</label>
            <input id="p-date" type="date" className={input} value={f.project_date} onChange={(e) => set("project_date", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="p-author">Author</label>
            <input id="p-author" className={input} value={f.author} maxLength={120} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="p-url">Live URL (optional)</label>
            <input id="p-url" type="url" className={input} value={f.live_url} maxLength={500} onChange={(e) => set("live_url", e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <label className={label} htmlFor="p-client">Client name</label>
            <input id="p-client" className={input} value={f.client_name} maxLength={120} onChange={(e) => set("client_name", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="p-country">Client country</label>
            <input id="p-country" className={input} value={f.client_country} maxLength={120} onChange={(e) => set("client_country", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="p-langs">Programming languages / tech (comma separated)</label>
            <input id="p-langs" className={input} value={f.languages} maxLength={500} onChange={(e) => set("languages", e.target.value)} placeholder="React, Next.js, TypeScript" />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="p-desc">Description</label>
            <textarea id="p-desc" rows={5} className={input} value={f.description} maxLength={4000} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <span className={label}>Feature image</span>
            <div className="flex items-center gap-4">
              <div className="h-24 w-40 overflow-hidden rounded-xl border border-border bg-muted">
                {f.feature_image && <img src={imageUrl(f.feature_image)} alt="" className="h-full w-full object-cover object-top" />}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                <Upload className="h-4 w-4" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => void handleUpload(e.target.files, "feature")} />
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className={label}>Additional images</span>
            <div className="flex flex-wrap gap-3">
              {f.images.map((img) => (
                <div key={img} className="relative h-20 w-32 overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={imageUrl(img)} alt="" className="h-full w-full object-cover object-top" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setF((p) => ({ ...p, images: p.images.filter((x) => x !== img) }))}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="grid h-20 w-32 cursor-pointer place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:bg-muted">
                <span className="flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => void handleUpload(e.target.files, "gallery")} />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input id="p-pub" type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4" />
            <label htmlFor="p-pub" className="text-sm text-foreground">Published</label>
          </div>
          <div>
            <label className={label} htmlFor="p-order">Sort order</label>
            <input id="p-order" type="number" className={input} value={f.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Cancel</button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {uploading ? "Uploading…" : saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SimpleTable({ table, columns }: { table: string; columns: string[] }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [busy, setBusy] = useState(true);

  const load = useCallback(async () => {
    setBusy(true);
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Record<string, unknown>[]) ?? []);
    setBusy(false);
  }, [table]);

  useEffect(() => {
    void load();
  }, [load]);

  const del = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    void load();
  };

  if (busy) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  if (!rows.length) return <p className="text-muted-foreground">Nothing here yet.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-semibold">{c.replace(/_/g, " ")}</th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r['id'])} className="border-t border-border align-top">
              {columns.map((c) => (
                <td key={c} className="max-w-xs px-4 py-3 text-foreground">
                  {c === "created_at" ? new Date(String(r[c])).toLocaleString() : String(r[c] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <button onClick={() => void del(String(r['id']))} aria-label="Delete row" className="text-destructive hover:opacity-70">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
