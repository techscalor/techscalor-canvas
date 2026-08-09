import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — TechScalor" },
      { name: "description", content: "Sign in or create your TechScalor account to access the project dashboard." },
      { property: "og:title", content: "Sign in — TechScalor" },
      { property: "og:description", content: "Sign in or create your TechScalor account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) void navigate({ to: isAdmin ? "/admin" : "/" });
  }, [user, isAdmin, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-hero px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <img src="/logo.png" alt="TechScalor" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-foreground">TechScalor</span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Access your dashboard." : "New accounts start with the user role."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              maxLength={72}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "No account? Register" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
