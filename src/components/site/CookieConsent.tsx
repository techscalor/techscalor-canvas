import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && !localStorage.getItem("ts-cookie-consent")) {
        setVisible(true);
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;
  const accept = () => {
    localStorage.setItem("ts-cookie-consent", "accepted");
    setVisible(false);
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40">
      <div className="glass shadow-elevated rounded-2xl p-4 flex items-start gap-3">
        <div className="flex-1 text-sm">
          <div className="font-semibold text-foreground">We use cookies</div>
          <p className="text-muted-foreground mt-1">
            We use cookies to enhance your browsing experience and analyze traffic.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={accept}
            className="rounded-full bg-gradient-brand text-white text-xs font-semibold px-4 py-2"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3 inline" /> Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
