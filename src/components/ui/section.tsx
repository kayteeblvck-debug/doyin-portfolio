"use client";

import type { ReactNode } from "react";
import { CONTAINER, GRID } from "./grid";
import { Reveal, Rule } from "./reveal";

/**
 * A numbered section. A full-measure rule opens it; the index and label sit
 * in the first bay (columns 1–3) and the heading starts on column 4.
 */
export function Section({
  id,
  children,
  band = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  /** a raised full-bleed band, used to set a section apart as its own chapter */
  band?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 scroll-mt-16 py-24 md:py-32 ${
        band ? "border-y border-line bg-raised" : ""
      } ${className}`}
    >
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

/** "01 / About" — the index used in section heads, nav and the counter. */
export function Index({ number, label }: { number: string; label: string }) {
  return (
    <span className="label inline-flex items-baseline gap-2.5">
      <span className="tnum text-red-hi">{number}</span>
      <span aria-hidden className="text-fg-4">
        /
      </span>
      <span>{label}</span>
    </span>
  );
}

export function SectionHead({
  number,
  eyebrow,
  heading,
  intro,
  aside,
}: {
  number: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  /** optional element set at the right of the intro row, e.g. a button */
  aside?: ReactNode;
}) {
  return (
    <header className="mb-16 md:mb-20">
      <Rule tone="strong" />
      <div className={`${GRID} gap-y-6 pt-6`}>
        <Reveal className="col-span-4 md:col-span-3">
          <Index number={number} label={eyebrow} />
        </Reveal>

        <div className="col-span-4 md:col-span-9">
          <Reveal>
            <h2 className="display text-balance text-[2.5rem] sm:text-5xl lg:text-[3.75rem]">
              {heading}
            </h2>
          </Reveal>

          {intro || aside ? (
            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                {intro ? (
                  <p className="text-pretty max-w-[38rem] text-[17px] leading-relaxed text-fg-2">
                    {intro}
                  </p>
                ) : null}
                {aside ? <div className="shrink-0">{aside}</div> : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </header>
  );
}
