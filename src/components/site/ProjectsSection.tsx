import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowRight, ChevronLeft, ChevronRight, X, Search, ExternalLink,
  Calendar, User, MapPin,
} from "lucide-react";
import projectsData from "@/data/projects.json";

export type Project = {
  id: string;
  title: string;
  category: string;
  /** optional folder hint, e.g. "agency/p1" — images live in public/projects/<folder>/ */
  folder?: string;
  date: string;
  clientName: string;
  clientCountry: string;
  description: string;
  url?: string;
  tech: string[];
  featureImage: string;
  images: string[];
};

const PROJECTS = projectsData as Project[];
const CATEGORIES = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];

/** In-memory cache so an image is only decoded/fetched once per session. */
const imgCache = new Set<string>();
function preload(src?: string) {
  if (!src || typeof window === "undefined" || imgCache.has(src)) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  imgCache.add(src);
}

function SmartImage({
  src,
  alt,
  className,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(() => imgCache.has(src));
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => {
        imgCache.add(src);
        setLoaded(true);
      }}
      className={`${className ?? ""} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ---------------- Modal with slider ---------------- */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const slides = project.images.length ? project.images : [project.featureImage];
  const [i, setI] = useState(0);
  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevated"
      >
        <button
          onClick={onClose}
          aria-label="Close project"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Slider */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={slides[i]}
              src={slides[i]}
              alt={`${project.title} screenshot ${i + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover object-top"
            />
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s}
                    onClick={() => setI(idx)}
                    aria-label={`Go to image ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {slides.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-border px-6 py-3">
            {slides.map((s, idx) => (
              <button
                key={s}
                onClick={() => setI(idx)}
                className={`h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={s} alt="" className="h-full w-full object-cover object-top" />
              </button>
            ))}
          </div>
        )}

        {/* Overview */}
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {project.category}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{project.title}</h3>
            <p className="mt-4 text-muted-foreground">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-semibold text-white">
                  {t}
                </span>
              ))}
            </div>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                Visit Live Site <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <dl className="space-y-4 rounded-2xl border border-border bg-background p-5 text-sm">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">Client</dt>
                <dd className="font-semibold text-foreground">{project.clientName}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">Country</dt>
                <dd className="font-semibold text-foreground">{project.clientCountry}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">Delivered</dt>
                <dd className="font-semibold text-foreground">{formatDate(project.date)}</dd>
              </div>
            </div>
          </dl>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Section ---------------- */
export function Projects() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Project | null>(null);

  const list = PROJECTS.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (q.trim() === "" ||
        (p.title + p.description + p.clientName + p.tech.join(" ")).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <section id="projects" className="relative bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Selected <span className="text-gradient-brand">work</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A few products we've shipped for startups and enterprises around the world.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  cat === c
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 6) * 0.05 }}
              onClick={() => setActive(p)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={p.featureImage}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-foreground">
                    View project <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {t}
                    </span>
                  ))}
                  {p.tech.length > 4 && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      +{p.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {list.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No projects match your search.</div>
        )}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
