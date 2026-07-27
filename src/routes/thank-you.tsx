import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank you — TechScalor" },
      { name: "description", content: "Thanks for reaching out to TechScalor. We'll be in touch within 24 hours." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank you — TechScalor" },
      { property: "og:description", content: "Your message has been received." },
      { property: "og:url", content: "/thank-you" },
    ],
    links: [{ rel: "canonical", href: "/thank-you" }],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-hero px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-brand text-white shadow-glow">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-foreground">Thank you!</h1>
        <p className="mt-3 text-muted-foreground">
          Your message has been received. A member of our team will be in touch within 24 hours.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow hover:scale-105 transition-transform">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </main>
  );
}
