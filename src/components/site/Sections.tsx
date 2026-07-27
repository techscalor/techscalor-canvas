import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Play, Sparkles, Code2, Cpu, Cloud, Smartphone, ShoppingCart,
  Layers, Database, Boxes, Palette, Wrench, GitBranch, Bot, ServerCog,
  LineChart, ShieldCheck, Zap, Rocket, CheckCircle2, Star, Github, Linkedin,
  Mail, ExternalLink, Search, MessageSquare, Compass, PenTool, TestTube2,
  Send, Package, HeartHandshake, Users, MapPin, Phone, ChevronDown,
} from "lucide-react";
import { useState as useReactState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import heroVisual from "@/assets/hero-visual.jpg";

/* ---------------- Counter ---------------- */
function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (inView) mv.set(to);
    const unsub = sp.on("change", (v) => setDisplay(Math.round(v).toString()));
    return () => unsub();
  }, [inView, to, mv, sp]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ---------------- Section wrapper ---------------- */
function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
      <Sparkles className="h-3 w-3 text-primary" />
      {children}
    </div>
  );
}

function Heading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-14`}>
      {eyebrow && <div className={center ? "flex justify-center" : ""}><Eyebrow>{eyebrow}</Eyebrow></div>}
      <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

/* ---------------- HERO ---------------- */
const TYPING = ["Websites.", "AI Solutions.", "SaaS Platforms.", "Mobile Apps.", "Cloud Systems."];
function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = TYPING[i % TYPING.length];
    const t = setTimeout(() => {
      if (!del) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDel(false); setI((v) => v + 1); }
      }
    }, del ? 40 : 80);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return <span className="text-gradient-brand">{text}<span className="animate-pulse">|</span></span>;
}

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Eyebrow>Trusted by 50+ teams worldwide</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-center text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground max-w-5xl mx-auto"
        >
          Building Technology<br />
          That <span className="text-gradient-brand">Scales</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground"
        >
          We build modern <Typewriter /><br />
          High-performance software that helps startups and enterprises grow with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Play className="h-4 w-4" /> View Portfolio
          </a>
        </motion.div>

        {/* Hero visual with floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mt-20 mx-auto max-w-5xl"
        >
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-elevated">
            <img
              src={heroVisual}
              alt="TechScalor product visualization"
              className="w-full h-auto"
              width={1600}
              height={1200}
              fetchPriority="high"
            />
          </div>

          <motion.div
            className="hidden md:flex absolute -left-10 top-16 glass rounded-2xl p-4 gap-3 items-center shadow-elevated animate-float-slow"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Deploy speed</div>
              <div className="text-sm font-semibold text-foreground">2.4× faster</div>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:flex absolute -right-8 top-32 glass rounded-2xl p-4 gap-3 items-center shadow-elevated animate-float-med"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Uptime</div>
              <div className="text-sm font-semibold text-foreground">99.99% SLA</div>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:flex absolute -right-4 -bottom-8 glass rounded-2xl p-4 gap-3 items-center shadow-elevated animate-float-slow"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shrink-0">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Client growth</div>
              <div className="text-sm font-semibold text-foreground">+280% YoY</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-8">
          {[
            { n: 100, s: "+", l: "Projects Delivered" },
            { n: 8, s: "+", l: "Years Experience" },
            { n: 50, s: "+", l: "Happy Clients" },
            { n: 99, s: "%", l: "Client Satisfaction" },
            { n: 24, s: "/7", l: "Support" },
          ].map((it) => (
            <div key={it.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">
                <Counter to={it.n} suffix={it.s} />
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{it.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
export function About() {
  const values = [
    { icon: Sparkles, label: "Innovation" },
    { icon: CheckCircle2, label: "Quality" },
    { icon: ShieldCheck, label: "Transparency" },
    { icon: Rocket, label: "Scalability" },
    { icon: HeartHandshake, label: "Long-Term Partnership" },
  ];
  const timeline = [
    { y: "2017", t: "Founded", d: "TechScalor started with a small team of engineers passionate about scalable software." },
    { y: "2019", t: "First 25 clients", d: "Delivered enterprise-grade platforms across e-commerce and fintech." },
    { y: "2021", t: "AI Practice", d: "Launched our AI/ML division, shipping production systems for global brands." },
    { y: "2023", t: "Global Team", d: "Expanded to 30+ engineers across 4 countries with 24/7 delivery." },
    { y: "2025", t: "100+ Projects", d: "Crossed 100 delivered projects with a 99% client-satisfaction score." },
  ];
  return (
    <Section id="about" className="bg-muted/40">
      <Heading eyebrow="About TechScalor" title={<>Engineered for growth, <span className="text-gradient-brand">built to last</span></>} subtitle="We're a software company obsessed with performance, craft, and outcomes. From MVPs to enterprise systems, we ship products people actually use." />

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-card border border-border p-8 shadow-card">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest">Mission</div>
          <h3 className="mt-2 text-2xl font-bold text-foreground">Empower every business with software that scales.</h3>
          <p className="mt-3 text-muted-foreground">We turn ambitious ideas into resilient digital products — from a single landing page to platforms serving millions of users.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-3xl bg-card border border-border p-8 shadow-card">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest">Vision</div>
          <h3 className="mt-2 text-2xl font-bold text-foreground">The engineering partner of choice for the next decade of builders.</h3>
          <p className="mt-3 text-muted-foreground">A company where technology is never the bottleneck — only the accelerator.</p>
        </motion.div>
      </div>

      <div className="mt-14">
        <div className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Our Values</div>
        <div className="flex flex-wrap justify-center gap-3">
          {values.map((v) => (
            <div key={v.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-card">
              <v.icon className="h-4 w-4 text-primary" />
              {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((it, idx) => (
              <motion.div
                key={it.y}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${idx % 2 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="hidden md:block flex-1" />
                <div className="absolute left-4 md:left-1/2 h-3 w-3 rounded-full bg-gradient-brand md:-translate-x-1/2 mt-2 shadow-glow" />
                <div className="ml-10 md:ml-0 flex-1 rounded-2xl bg-card border border-border p-6 shadow-card">
                  <div className="text-xs font-bold text-primary">{it.y}</div>
                  <div className="mt-1 font-semibold text-foreground">{it.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{it.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICES = [
  { icon: Code2, t: "Website Development", d: "Fast, SEO-friendly marketing sites and portals built with Next.js and modern stacks." },
  { icon: Boxes, t: "Custom Software", d: "Purpose-built applications tailored to your workflows and business logic." },
  { icon: Bot, t: "AI Solutions", d: "LLM apps, computer vision, and predictive systems in production." },
  { icon: Layers, t: "SaaS Development", d: "Multi-tenant platforms with billing, auth, and analytics from day one." },
  { icon: ShoppingCart, t: "eCommerce", d: "High-converting stores on Shopify, Medusa, and custom stacks." },
  { icon: Smartphone, t: "Mobile Apps", d: "React Native and Flutter apps for iOS and Android." },
  { icon: Cloud, t: "Cloud Solutions", d: "AWS, GCP, and Azure architecture built for scale and cost-efficiency." },
  { icon: Wrench, t: "API Integration", d: "Bulletproof integrations with Stripe, Twilio, Salesforce, and beyond." },
  { icon: Database, t: "ERP Systems", d: "Streamline operations with tailored ERP built for your industry." },
  { icon: Users, t: "CRM Systems", d: "Sales and customer lifecycle platforms that ship value fast." },
  { icon: Cpu, t: "Automation", d: "Workflow automation, RPA, and AI copilots that save hours daily." },
  { icon: Palette, t: "UI/UX Design", d: "Beautiful, accessible product design informed by real user research." },
  { icon: ServerCog, t: "DevOps", d: "CI/CD, IaC, observability, and zero-downtime deploys." },
  { icon: Database, t: "Database Design", d: "Schema modeling, migrations, and query performance tuning." },
  { icon: GitBranch, t: "Maintenance", d: "Proactive upgrades, monitoring, and 24/7 support SLAs." },
  { icon: Compass, t: "IT Consulting", d: "Strategy, architecture reviews, and technology roadmaps." },
];

export function Services() {
  return (
    <Section id="services">
      <Heading eyebrow="What we do" title={<>Full-spectrum <span className="text-gradient-brand">software services</span></>} subtitle="One partner for design, engineering, cloud, and AI — from prototype to global scale." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 4) * 0.05 }}
            className="group relative rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden hover:shadow-elevated transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-brand" style={{ mixBlendMode: "multiply", filter: "blur(60px)", transform: "scale(0.5)" }} />
            <div className="relative">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold text-foreground">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PROJECTS ---------------- */
const CATEGORIES = ["All", "Websites", "Web Apps", "Mobile Apps", "AI", "SaaS", "eCommerce", "Admin Panels"] as const;
type Cat = typeof CATEGORIES[number];

const PROJECTS: { name: string; cat: Exclude<Cat, "All">; stack: string[]; d: string; grad: string; url: string; github?: string }[] = [
  { name: "Nimbus Analytics", cat: "SaaS", stack: ["Next.js", "PostgreSQL", "Stripe"], d: "Real-time product analytics for growth teams.", grad: "from-blue-500 to-cyan-400", url: "https://example.com", github: "https://github.com" },
  { name: "Loom Commerce", cat: "eCommerce", stack: ["Shopify", "React", "GraphQL"], d: "Headless storefront for a global apparel brand.", grad: "from-purple-500 to-pink-500", url: "https://example.com" },
  { name: "Vertex AI Studio", cat: "AI", stack: ["Python", "FastAPI", "OpenAI"], d: "Enterprise-grade AI orchestration platform.", grad: "from-emerald-500 to-teal-400", url: "https://example.com" },
  { name: "PocketBank", cat: "Mobile Apps", stack: ["React Native", "Node.js"], d: "Neobank mobile app with biometric auth.", grad: "from-amber-500 to-orange-500", url: "https://example.com" },
  { name: "Kepler CRM", cat: "Web Apps", stack: ["Vue", "NestJS", "MongoDB"], d: "Modern CRM for high-velocity sales teams.", grad: "from-indigo-500 to-blue-500", url: "https://example.com" },
  { name: "Solstice.io", cat: "Websites", stack: ["Astro", "Tailwind"], d: "Marketing site for a YC-backed startup.", grad: "from-rose-500 to-red-500", url: "https://example.com" },
  { name: "Atlas Admin", cat: "Admin Panels", stack: ["React", "TypeScript", "tRPC"], d: "Multi-tenant admin dashboard with RBAC.", grad: "from-sky-500 to-indigo-500", url: "https://example.com", github: "https://github.com" },
  { name: "Harbor SaaS", cat: "SaaS", stack: ["Next.js", "Supabase"], d: "Team collaboration platform with real-time sync.", grad: "from-teal-500 to-emerald-400", url: "https://example.com" },
  { name: "Verdant Grocer", cat: "eCommerce", stack: ["Medusa", "Remix"], d: "Farm-to-door grocery marketplace.", grad: "from-lime-500 to-green-500", url: "https://example.com" },
  { name: "Chronos Fitness", cat: "Mobile Apps", stack: ["Flutter", "Firebase"], d: "AI-powered fitness coaching companion.", grad: "from-fuchsia-500 to-purple-500", url: "https://example.com" },
  { name: "Prism Vision", cat: "AI", stack: ["PyTorch", "AWS"], d: "Computer vision for retail shelf intelligence.", grad: "from-cyan-500 to-blue-600", url: "https://example.com" },
  { name: "Meridian Ops", cat: "Admin Panels", stack: ["Angular", "Java Spring"], d: "Enterprise ops console for logistics.", grad: "from-slate-500 to-slate-700", url: "https://example.com" },
];

export function Projects() {
  const [cat, setCat] = useReactState<Cat>("All");
  const [q, setQ] = useReactState("");
  const list = PROJECTS.filter((p) =>
    (cat === "All" || p.cat === cat) &&
    (q.trim() === "" || (p.name + p.d + p.stack.join(" ")).toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <Section id="projects" className="bg-muted/40">
      <Heading eyebrow="Portfolio" title={<>Selected <span className="text-gradient-brand">work</span></>} subtitle="A few products we've shipped for startups and enterprises around the world." />

      <div className="mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                cat === c
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 6) * 0.05 }}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
          >
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-[16/10] overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${p.grad} transition-transform duration-700 group-hover:scale-110`} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="glass-dark rounded-xl px-5 py-3 text-white text-sm font-bold tracking-wide">
                  {p.name}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                  {p.cat}
                </span>
              </div>
            </a>
            <div className="p-5">
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  View Project <ExternalLink className="h-3 w-3" />
                </a>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 rounded-full bg-gradient-brand px-3 py-1 text-[11px] font-bold text-white">
                  LIVE DEMO
                </a>
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="grid h-7 w-7 place-items-center rounded-full border border-border">
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No projects match your search.</div>
      )}
    </Section>
  );
}

/* ---------------- TECH ---------------- */
const TECHS = ["React", "Next.js", "Vue", "Node.js", "Express", "Laravel", "PHP", "Python", "Django", "FastAPI", "Java", "Spring Boot", "Flutter", "React Native", "Supabase", "Firebase", "PostgreSQL", "MongoDB", "MySQL", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Vercel", "Cloudflare", "GitHub", "OpenAI", "Stripe"];
export function Technologies() {
  return (
    <Section id="tech">
      <Heading eyebrow="Our Stack" title={<>Built with the <span className="text-gradient-brand">best tools</span> in the industry</>} subtitle="We pick the right technology for the job — modern, proven, and production-ready." />
      <div className="relative overflow-hidden">
        <div className="flex gap-3 animate-marquee w-max">
          {[...TECHS, ...TECHS].map((t, i) => (
            <div key={i} className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 shadow-card">
              <div className="h-2 w-2 rounded-full bg-gradient-brand" />
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{t}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </Section>
  );
}

/* ---------------- PROCESS ---------------- */
const PROCESS = [
  { icon: Search, t: "Discovery", d: "We deep-dive into your goals, users, and constraints." },
  { icon: Compass, t: "Planning", d: "Roadmap, architecture, and success metrics." },
  { icon: PenTool, t: "Design", d: "Beautiful, accessible UI backed by real research." },
  { icon: Code2, t: "Development", d: "Iterative sprints with weekly demos." },
  { icon: TestTube2, t: "Testing", d: "Automated + manual QA across devices." },
  { icon: Send, t: "Deployment", d: "Zero-downtime rollouts with observability baked-in." },
  { icon: HeartHandshake, t: "Support", d: "SLA-backed maintenance and continuous improvement." },
];
export function Process() {
  return (
    <Section id="process" className="bg-muted/40">
      <Heading eyebrow="How we work" title={<>A proven <span className="text-gradient-brand">7-step process</span></>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROCESS.map((p, i) => (
          <motion.div key={p.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-card relative overflow-hidden">
            <div className="absolute top-3 right-4 text-6xl font-black text-primary/5">{String(i + 1).padStart(2, "0")}</div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <p.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold text-foreground">{p.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- WHY US ---------------- */
const WHY = [
  { icon: Zap, t: "Fast Delivery", d: "Sprint-based delivery with weekly demos." },
  { icon: Code2, t: "Clean Code", d: "Maintainable, tested, and documented." },
  { icon: Rocket, t: "Scalable Architecture", d: "Designed for 10× growth from day one." },
  { icon: Palette, t: "Modern UI", d: "Design that converts and delights." },
  { icon: Search, t: "SEO Friendly", d: "Core Web Vitals baked in." },
  { icon: HeartHandshake, t: "Affordable", d: "Enterprise quality without the enterprise price." },
  { icon: Sparkles, t: "Latest Technologies", d: "Battle-tested modern stacks." },
  { icon: MessagesIcon, t: "Dedicated Support", d: "Slack access to your engineering team." },
  { icon: ShieldCheck, t: "Secure Development", d: "OWASP best practices, always." },
];
function MessagesIcon(props: React.SVGProps<SVGSVGElement>) { return <MessageSquare {...props} />; }
export function WhyUs() {
  return (
    <Section id="why">
      <Heading eyebrow="Why TechScalor" title={<>Reasons teams <span className="text-gradient-brand">choose us</span></>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY.map((w, i) => (
          <motion.div key={w.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-card flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <w.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{w.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{w.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- TEAM ---------------- */
const TEAM_REAL = [
  { name: "Jawad Ali", role: "CEO • Senior Full Stack Engineer", initials: "JA", grad: "from-blue-500 to-cyan-400" },
  { name: "Subhan", role: "Senior Full Stack Engineer", initials: "SU", grad: "from-purple-500 to-pink-500" },
  { name: "Muhammad Ahsan", role: "Python / AI Engineer", initials: "MA", grad: "from-emerald-500 to-teal-400" },
  { name: "Qayoom Ali", role: "Graphic Designer", initials: "QA", grad: "from-amber-500 to-orange-500" },
  { name: "Jabi Ul Hassan", role: "Sales Manager", initials: "JH", grad: "from-rose-500 to-red-500" },
];
const TEAM_MORE = [
  { name: "Ayesha Khan", role: "Frontend Developer", initials: "AK", grad: "from-sky-500 to-indigo-500" },
  { name: "David Chen", role: "Backend Developer", initials: "DC", grad: "from-teal-500 to-emerald-400" },
  { name: "Priya Rao", role: "Mobile App Developer", initials: "PR", grad: "from-fuchsia-500 to-purple-500" },
  { name: "Omar Farooq", role: "DevOps Engineer", initials: "OF", grad: "from-cyan-500 to-blue-600" },
  { name: "Sara Ito", role: "Cloud Engineer", initials: "SI", grad: "from-indigo-500 to-blue-500" },
  { name: "Liam Novak", role: "QA Engineer", initials: "LN", grad: "from-slate-500 to-slate-700" },
  { name: "Nadia Rahman", role: "Project Manager", initials: "NR", grad: "from-blue-500 to-cyan-400" },
  { name: "Kai Fischer", role: "Business Analyst", initials: "KF", grad: "from-purple-500 to-pink-500" },
  { name: "Lena Torres", role: "UI/UX Designer", initials: "LT", grad: "from-emerald-500 to-teal-400" },
  { name: "Yusuf Adeyemi", role: "Digital Marketing Specialist", initials: "YA", grad: "from-amber-500 to-orange-500" },
  { name: "Maya Okafor", role: "Content Writer", initials: "MO", grad: "from-rose-500 to-red-500" },
  { name: "Ethan Park", role: "Customer Success Manager", initials: "EP", grad: "from-sky-500 to-indigo-500" },
];

function TeamCard({ p }: { p: { name: string; role: string; initials: string; grad: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all"
    >
      <div className={`aspect-square bg-gradient-to-br ${p.grad} relative grid place-items-center`}>
        <div className="text-5xl font-black text-white/90">{p.initials}</div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-5">
        <div className="font-semibold text-foreground">{p.name}</div>
        <div className="text-sm text-muted-foreground">{p.role}</div>
        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href="#" aria-label="LinkedIn" className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Linkedin className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="GitHub" className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Github className="h-3.5 w-3.5" /></a>
          <a href="mailto:info@techscalor.com" aria-label="Email" className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Mail className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </motion.div>
  );
}
export function Team() {
  return (
    <Section id="team" className="bg-muted/40">
      <Heading eyebrow="Our Team" title={<>The people <span className="text-gradient-brand">behind the work</span></>} subtitle="A distributed team of engineers, designers, and strategists shipping across time zones." />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...TEAM_REAL, ...TEAM_MORE].map((p) => (
          <TeamCard key={p.name} p={p} />
        ))}
      </div>
    </Section>
  );
}

/* ---------------- REVIEWS ---------------- */
const REVIEWS = [
  { n: "Sarah Mitchell", c: "Growthstack Inc.", r: "TechScalor rebuilt our SaaS from the ground up. Load times dropped 4× and our NPS jumped 22 points.", i: "SM" },
  { n: "Rajiv Patel", c: "Zenith Retail", r: "They delivered our ecommerce platform in 10 weeks — under budget, over expectations.", i: "RP" },
  { n: "Emma Larsson", c: "Northlight AI", r: "The best engineering partner we've ever worked with. Genuine ownership from day one.", i: "EL" },
  { n: "Daniel Wu", c: "OrbitCRM", r: "Clean code, thoughtful architecture, and a team that genuinely cares about outcomes.", i: "DW" },
  { n: "Aisha Bello", c: "Kaya Health", r: "They handled our HIPAA rollout flawlessly. Our compliance auditor was impressed.", i: "AB" },
  { n: "Marco Rossi", c: "Volante Auto", r: "Our mobile app went from concept to App Store in 12 weeks. Highly recommend.", i: "MR" },
  { n: "Priya Sharma", c: "Lumen Edu", r: "Design and engineering in one team. That's rare. That's TechScalor.", i: "PS" },
  { n: "James O'Connor", c: "Harbor Fintech", r: "They took our legacy monolith and turned it into a scalable, maintainable system.", i: "JO" },
  { n: "Yuki Tanaka", c: "MerakiApps", r: "Best-in-class communication. Weekly demos, honest updates, zero surprises.", i: "YT" },
  { n: "Fatima Rahman", c: "Signal Labs", r: "Our AI product wouldn't exist without them. Deep expertise in LLMs and MLOps.", i: "FR" },
];

export function Reviews() {
  const [i, setI] = useReactState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, [setI]);
  const cur = REVIEWS[i];
  return (
    <Section id="reviews">
      <Heading eyebrow="Testimonials" title={<>Loved by <span className="text-gradient-brand">founders & CTOs</span></>} />
      <div className="mx-auto max-w-3xl">
        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-elevated text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, x) => <Star key={x} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed">"{cur.r}"</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-white font-bold">{cur.i}</div>
            <div className="text-left">
              <div className="font-semibold text-foreground">{cur.n}</div>
              <div className="text-sm text-muted-foreground">{cur.c}</div>
            </div>
          </div>
        </motion.div>
        <div className="mt-6 flex justify-center gap-2">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-gradient-brand" : "w-2 bg-border"}`}
              aria-label={`Testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQ = [
  { q: "How long does a typical project take?", a: "Most MVPs ship in 6–10 weeks. Larger platforms range from 3–6 months. We provide a detailed timeline after discovery." },
  { q: "Do you sign NDAs?", a: "Absolutely. We sign an NDA before any technical discussion and can work under your master services agreement." },
  { q: "What is your pricing model?", a: "We offer both fixed-scope and time & materials engagements. Retainer plans are available for ongoing work." },
  { q: "Do you provide post-launch support?", a: "Yes — we offer 24/7 SLA-backed maintenance, monitoring, and continuous improvement packages." },
  { q: "Which industries do you serve?", a: "We've shipped for fintech, healthtech, ecommerce, SaaS, education, logistics, and more." },
  { q: "Can you integrate with our existing systems?", a: "Yes. Our engineers regularly integrate with legacy databases, ERPs, CRMs, and third-party APIs." },
  { q: "Do you own the code we pay for?", a: "You own 100% of the IP we build for you — repos, designs, and all deliverables." },
  { q: "How do you handle security?", a: "We follow OWASP best practices, run automated security scans, and can support SOC 2 / HIPAA workflows." },
  { q: "Can you scale the team up or down?", a: "Yes. We can add or reduce engineers within 1–2 weeks based on project velocity." },
  { q: "What if I already have a design or spec?", a: "Perfect — we'll audit it and jump straight into build. If not, our design team can create it with you." },
];
export function Faq() {
  const [open, setOpen] = useReactState<number | null>(0);
  return (
    <Section id="faq" className="bg-muted/40">
      <Heading eyebrow="FAQ" title={<>Questions, <span className="text-gradient-brand">answered</span></>} />
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ.map((f, i) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open === i}
            >
              <span className="font-semibold text-foreground">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-muted-foreground">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- CONTACT ---------------- */
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().max(40).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please share a bit more").max(2000),
});

export function Contact() {
  const [loading, setLoading] = useReactState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const res = contactSchema.safeParse(data);
    if (!res.success) {
      toast.error(res.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Thanks! We'll be in touch within 24 hours.");
    e.currentTarget.reset();
  };
  return (
    <Section id="contact">
      <Heading eyebrow="Get in touch" title={<>Let's build <span className="text-gradient-brand">something great</span></>} subtitle="Tell us about your project. We reply within 24 hours." />
      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" required />
            <Field label="Company" name="company" />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" />
            <Field label="Country" name="country" />
            <SelectField label="Budget" name="budget" options={["< $5k", "$5k – $15k", "$15k – $50k", "$50k+"]} />
          </div>
          <SelectField label="Service" name="service" options={SERVICES.map((s) => s.t)} />
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Message *</label>
            <textarea name="message" rows={5} required className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us about your project..." />
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60 transition-transform hover:scale-[1.02]">
            {loading ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow"><Mail className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Email us</div>
                <a href="mailto:info@techscalor.com" className="font-semibold text-foreground hover:underline">info@techscalor.com</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow"><Phone className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">WhatsApp</div>
                <a href="https://wa.me/923296121520" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">+92 329 6121520</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Global</div>
                <div className="font-semibold text-foreground">Distributed team, worldwide</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border overflow-hidden shadow-card aspect-[4/3] relative bg-gradient-brand grid place-items-center">
            <div className="absolute inset-0 opacity-30 grid-pattern" />
            <div className="relative text-center text-white p-6">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <div className="font-semibold">Map view</div>
              <div className="text-sm opacity-80">Google Maps embed placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}
function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</label>
      <select name={name} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ---------------- NEWSLETTER + FOOTER ---------------- */
export function Newsletter() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string) ?? "";
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Please enter a valid email"); return; }
    toast.success("You're subscribed!");
    e.currentTarget.reset();
  };
  return (
    <Section className="py-16">
      <div className="rounded-3xl bg-gradient-brand p-10 sm:p-14 text-center shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative">
          <h3 className="text-3xl sm:text-4xl font-bold text-white">Get startup & engineering insights</h3>
          <p className="mt-2 text-white/90">Monthly newsletter. No spam. Unsubscribe anytime.</p>
          <form onSubmit={onSubmit} className="mt-6 mx-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <input name="email" type="email" required placeholder="you@company.com" className="flex-1 rounded-full px-5 py-3 text-sm text-foreground bg-white/95 focus:outline-none focus:ring-2 focus:ring-white" />
            <button className="rounded-full bg-ink text-white px-6 py-3 text-sm font-semibold hover:bg-black transition-colors">Subscribe</button>
          </form>
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-gradient-brand">TechScalor</div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">Building modern websites, AI solutions, SaaS platforms, mobile apps, and custom software that scale.</p>
            <div className="mt-4 flex gap-2">
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted"><Linkedin className="h-4 w-4" /></a>
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted"><Github className="h-4 w-4" /></a>
              <a href="mailto:info@techscalor.com" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Services</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-foreground">Web Development</a></li>
              <li><a href="#services" className="hover:text-foreground">Mobile Apps</a></li>
              <li><a href="#services" className="hover:text-foreground">AI Solutions</a></li>
              <li><a href="#services" className="hover:text-foreground">Cloud & DevOps</a></li>
              <li><a href="#services" className="hover:text-foreground">UI/UX Design</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground">About</a></li>
              <li><a href="#projects" className="hover:text-foreground">Projects</a></li>
              <li><a href="#team" className="hover:text-foreground">Team</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} TechScalor. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
