"use client";

import { capabilities, sections } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function WhatIDo() {
  return (
    <Section id="capabilities">
      <SectionHead {...sections.capabilities} />

      <ol className="grid gap-5 md:grid-cols-2">
        {capabilities.map((capability, i) => (
          <li key={capability.title}>
            <Reveal
              delay={0.05 * (i % 2)}
              className="h-full rounded-lg border border-line-2 bg-raised p-7 transition-colors duration-300 hover:border-line-3 sm:p-8"
            >
              <span className="tnum text-[14px] font-semibold text-red-hi">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-[1.5rem]">{capability.title}</h3>
              <p className="text-pretty mt-3 text-[16px] leading-[1.65] text-fg-2">
                {capability.description}
              </p>

              <p className="mt-6 text-[13px] font-semibold text-fg-3">{capability.pointsLabel}</p>
              {capability.pointsStyle === "chips" ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {capability.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-md border border-line-2 bg-raised-2 px-3 py-1.5 text-[14px] font-medium"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-3 space-y-3">
                  {capability.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[15px] leading-[1.6] text-fg-2">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-red-hi" />
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
