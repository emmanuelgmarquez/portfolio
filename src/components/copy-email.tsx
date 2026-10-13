"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

type Status = "idle" | "copied" | "failed";

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts and older browsers.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("Copy command was rejected");
}

export function CopyEmail() {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await writeClipboard(site.email);
      setStatus("copied");
      track("copy_email");
    } catch {
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2400);
  };

  return (
    <div className="flex flex-col gap-2 text-night-muted lg:items-end">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="select-all text-[0.95rem] text-night-ink">{site.email}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.07] px-4 text-sm text-night-ink transition-colors duration-300 hover:bg-white/15"
        aria-describedby="copy-status"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "copied" ? (
            <motion.span
              key="ok"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="inline-flex"
            >
              <Check size={16} className="text-signal-night" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="inline-flex"
            >
              <Copy size={16} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
        {status === "copied" ? "Copied" : "Copy email"}
      </button>
      </div>
      <span id="copy-status" role="status" aria-live="polite" className="min-h-5 text-sm">
        {status === "copied" && "Email address copied to clipboard."}
        {status === "failed" && "Couldn't copy automatically. Select the address to copy it."}
      </span>
    </div>
  );
}
