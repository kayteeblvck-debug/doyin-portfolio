"use client";

import { philosophy, sections } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/** Follows the banded Education section on the plain ground, so it reads as a new chapter. */
export function Philosophy() {
  return (
    <Section id="philosophy">
      <SectionHead {...sections.philosophy} />

      <ol className="grid gap-5 md:grid-cols-2">
        {philosophy.map((principle, i) => (
          <li key={principle.index}>
            <Reveal
              delay={0.05 * (i % 2)}
              className="flex h-full gap-5 rounded-lg border border-line-2 bg-raised p-7 sm:p-8"
            >
              <span className="display tnum shrink-0 text-[1.5rem] leading-[1.2] text-red-hi">
                {principle.index}
              </span>
              <div>
                <h3 className="display text-[1.3rem] leading-[1.25]">{principle.title}</h3>
                <p className="text-pretty mt-3 text-[16px] leading-[1.7] text-fg-2">{principle.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
