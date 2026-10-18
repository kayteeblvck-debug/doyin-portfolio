"use client";

import type { ReactNode } from "react";
import { CONTAINER } from "./grid";
import { Reveal } from "./reveal";

/** A page section. `band` gives it a slightly lighter background to set it apart. */
export function Section({
  id,
  children,
  band = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  band?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 md:py-24 ${band ? "bg-band" : ""} ${className}`}
    >
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

/** Eyebrow, heading and intro, set close together; optional action on the right. */
export function SectionHead({
  eyebrow,
  heading,
  intro,
  aside,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  aside?: ReactNode;
  /** accepted for compatibility with content.ts; not displayed */
  number?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
      <header className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display text-balance mt-3 text-[2rem] sm:text-[2.5rem]">{heading}</h2>
        {intro ? (
          <p className="text-pretty mt-4 text-[17px] leading-relaxed text-fg-2">{intro}</p>
        ) : null}
      </header>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </Reveal>
  );
}
