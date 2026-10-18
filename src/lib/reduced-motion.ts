"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference. motion's own hook reads the media
 * query during the first client render, so components that branch on it render
 * different markup from the server and trip a hydration mismatch. This one
 * reports `false` while hydrating (matching the server HTML) and switches to the
 * real preference immediately afterwards.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
