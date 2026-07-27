import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ArrowUp, MessagesSquare, X } from "lucide-react";

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-72 rounded-2xl bg-card shadow-elevated border border-border overflow-hidden"
            >
              <div className="bg-gradient-brand text-white p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">TechScalor Support</div>
                  <div className="text-xs opacity-80">Usually replies in minutes</div>
                </div>
                <button onClick={() => setChatOpen(false)} aria-label="Close chat">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                Hi! 👋 How can we help you scale today?
              </div>
              <a
                href="https://wa.me/923296121520"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-muted text-center py-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                Continue on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setChatOpen((v) => !v)}
          className="grid h-12 w-12 place-items-center rounded-full bg-card border border-border shadow-card hover:scale-110 transition-transform"
          aria-label="Live chat"
        >
          <MessagesSquare className="h-5 w-5 text-primary" />
        </button>

        <a
          href="https://wa.me/923296121520"
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-14 w-14 place-items-center rounded-full text-white shadow-glow hover:scale-110 transition-transform"
          style={{ background: "#25D366" }}
          aria-label="WhatsApp us"
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <AnimatePresence>
          {show && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-white shadow-glow hover:scale-110 transition-transform"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
