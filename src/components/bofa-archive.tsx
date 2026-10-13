"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { bofaArchiveItems } from "@/data/projects";
import { useLightbox } from "./lightbox";

const ORDER = [
  "Preferred Rewards",
  "Merrill & Investing",
  "Home Lending",
  "Auto Loans",
  "Small Business",
  "Workplace Benefits",
  "Consumer Banking",
];

export function BofaArchiveGrid() {
  const { open } = useLightbox();
  const [filter, setFilter] = useState<string>("All");
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of bofaArchiveItems) c[a.lob] = (c[a.lob] ?? 0) + 1;
    return c;
  }, []);
  const lobs = ORDER.filter((l) => counts[l]);
  const shown = filter === "All" ? bofaArchiveItems : bofaArchiveItems.filter((a) => a.lob === filter);

  return (
    <div className="mt-12">
      <div role="group" aria-label="Filter by line of business" className="flex flex-wrap gap-2">
        {["All", ...lobs].map((l) => {
          const active = l === filter;
          return (
            <button
              key={l}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(l)}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 ${
                active ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink hover:border-ink/50"
              }`}
            >
              {l}
              <span className={`tabular-nums ${active ? "text-paper/60" : "text-muted"}`}>
                {l === "All" ? bofaArchiveItems.length : counts[l]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} campaigns
      </p>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {shown.map((a) => (
          <li key={a.code}>
            <button
              type="button"
              onClick={() => open(a.src)}
              aria-label={`Open ${a.title} (${a.code}) at full size`}
              className="group block w-full cursor-zoom-in text-left"
            >
              <div className="email-shadow relative aspect-[3/4] overflow-hidden rounded-[3px] bg-white">
                <Image
                  src={a.thumb}
                  alt=""
                  width={480}
                  height={640}
                  sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                  quality={75}
                  className="block h-auto w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-snug text-ink">{a.title}</p>
              <p className="mt-1 text-xs tabular-nums text-muted">
                {a.code}
                {a.builds > 1 && <span> &middot; {a.builds} builds</span>}
                {a.spanish && <span> &middot; ES</span>}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
