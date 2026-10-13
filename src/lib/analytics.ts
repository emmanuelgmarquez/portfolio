/**
 * Google Analytics 4.
 *
 * The Measurement ID is public (it appears in every page's source), so it can live in code. It can also be
 * overridden with NEXT_PUBLIC_GA_ID in Vercel. Leave both empty to turn analytics off.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a GA4 event. Does nothing when analytics is off or the script has not loaded. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
