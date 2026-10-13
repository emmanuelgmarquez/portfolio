"use client";

import { motion, useReducedMotion } from "motion/react";

/** One restrained reveal used for large imagery: the panel unclips upward as it enters. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(12% 0% 0% 0% round 4px)", opacity: 0.001, y: 24 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 4px)", opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
