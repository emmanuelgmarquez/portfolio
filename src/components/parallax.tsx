"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Subtle scroll-linked drift for a single hero image. */
export function Parallax({ children, distance = 60 }: { children: React.ReactNode; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);
  return (
    <div ref={ref} className="overflow-hidden rounded-[4px]">
      <motion.div style={{ y: reduce ? 0 : y, scale: reduce ? 1 : 1.06 }}>{children}</motion.div>
    </div>
  );
}
