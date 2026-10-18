"use client";

import { capabilities, sections } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Four practice areas as a 2 × 2 matrix. Each cell is six columns wide, so
 * the two cells in a row start on the column-1 and column-7 guide lines.
 */
export function WhatIDo() {
  return (
    <Section id="capabilities">
      <SectionHead {...sections.capabilities} />

      <ol className={`${GRID} gap-y-16`}>
        {capabilities.map((capability, i) => (
          <li key={capability.title} className="col-span-4 md:col-span-6">
            <Reveal delay={0.06 * (i % 2)} className="group relative h-full border-t border-line-2 pt-7">
              {/* Hover: the top rule turns red from the left */}
              <span
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-red-hi transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <div className="flex items-baseline justify-between gap-6">
                <span className="label tnum !text-red-hi">{String(i + 1).padStart(2, "0")}</span>
                <span className="label">{capability.pointsLabel}</span>
              </div>

              <h3 className="display mt-6 text-[1.9rem] sm:text-[2.15rem]">{capability.title}</h3>
              <p className="text-pretty mt-4 max-w-[30rem] text-[16px] leading-[1.7] text-fg-2">
                {capability.description}
              </p>

              {capability.pointsStyle === "chips" ? (
                <ul className="mt-8 grid grid-cols-2 border-t border-l border-line">
                  {capability.points.map((point) => (
                    <li
                      key={point}
                      className="border-r border-b border-line px-4 py-3.5 text-[14px] font-medium text-fg transition-colors duration-300 hover:bg-raised"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-8 border-t border-line">
                  {capability.points.map((point, j) => (
                    <li
                      key={point}
                      className="grid grid-cols-[2.25rem_1fr] border-b border-line py-3.5 text-[14.5px] leading-[1.65] text-fg-2"
                    >
                      <span className="tnum text-[12px] font-semibold text-fg-4">
                        {String.fromCharCode(97 + j)}.
                      </span>
                      <PointText text={point} />
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** "Procurement: Reviewed how…" — the lead-in before the colon is set in white. */
function PointText({ text }: { text: string }) {
  const split = text.indexOf(": ");
  if (split === -1 || split > 40) return <span>{text}</span>;
  return (
    <span>
      <span className="font-semibold text-fg">{text.slice(0, split)}:</span>
      {text.slice(split + 1)}
    </span>
  );
}
