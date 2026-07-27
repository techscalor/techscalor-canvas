import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { CookieConsent } from "@/components/site/CookieConsent";
import {
  Hero, About, Services, Projects, Technologies, Process, WhyUs, Team, Reviews, Faq, Contact, Newsletter, Footer,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechScalor — Building Technology That Scales" },
      { name: "description", content: "TechScalor builds modern websites, AI solutions, SaaS platforms, mobile apps, cloud systems, and custom software for startups and enterprises worldwide." },
      { property: "og:title", content: "TechScalor — Building Technology That Scales" },
      { property: "og:description", content: "Custom software, AI, SaaS, mobile, and cloud solutions engineered for growth." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
      { name: "twitter:title", content: "TechScalor — Building Technology That Scales" },
      { name: "twitter:description", content: "Custom software, AI, SaaS, mobile, and cloud solutions engineered for growth." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Technologies />
        <Process />
        <WhyUs />
        <Team />
        <Reviews />
        <Faq />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
    </div>
  );
}
