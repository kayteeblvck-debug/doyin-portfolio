"use client";

import { philosophy, sections } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Set on a raised full-bleed band so it reads as its own chapter, not a
 * continuation of Education. Four principles, one per bay.
 */
export function Philosophy() {
  return (
    <Section id="philosophy" band>
      <SectionHead {...sections.philosophy} />

      <ol className={`${GRID} gap-y-14`}>
        {philosophy.map((principle, i) => (
          <li key={principle.index} className="col-span-4 md:col-span-6 lg:col-span-3">
            <Reveal delay={0.07 * i} className="group h-full border-t border-line-2 pt-6">
              <span className="display tnum numeral-outline block text-[4.5rem] leading-none transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:var(--red-hi)]">
                {principle.index}
              </span>
              <h3 className="display text-balance mt-8 text-[1.6rem] leading-[1.15] lg:min-h-[2.3em]">
                {principle.title}
              </h3>
              <p className="text-pretty mt-4 text-[15px] leading-[1.75] text-fg-2">
                {principle.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
