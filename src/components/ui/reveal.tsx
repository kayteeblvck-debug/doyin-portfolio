"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Short rise and fade on first scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A 1px rule that draws from the left edge when it scrolls into view. */
export function Rule({
  className = "",
  tone = "line",
  delay = 0,
}: {
  className?: string;
  tone?: "line" | "strong" | "red";
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const colour = { line: "bg-line", strong: "bg-line-2", red: "bg-red" }[tone];

  if (reduced) return <div aria-hidden className={`h-px ${colour} ${className}`} />;

  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left ${colour} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    />
  );
}
