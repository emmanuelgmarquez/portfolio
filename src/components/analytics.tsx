"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID, track } from "@/lib/analytics";

/**
 * Loads GA4 (page views, including client-side navigation, come from GA's enhanced measurement) and records
 * the contact clicks that matter for a portfolio: email links and LinkedIn.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : (a.closest("section")?.id || "page");
      if (href.startsWith("mailto:")) track("email_click", { link_location: where });
      else if (href.includes("linkedin.com")) track("linkedin_click", { link_location: where });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
