"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe media query. Reports `false` during hydration (matching the
 * server HTML) and the live value immediately afterwards.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
