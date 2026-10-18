"use client";

import { about, site } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  const [lede, ...rest] = about.paragraphs;

  return (
    <Section id="about">
      <SectionHead number={about.number} eyebrow={about.eyebrow} heading={about.heading} />

      <div className={`${GRID} gap-y-14`}>
        {/* Body — starts on column 4 with the heading above it */}
        <div className="col-span-4 md:col-span-9 md:col-start-4 lg:col-span-6 lg:col-start-4">
          <Reveal>
            <p className="serif text-pretty text-[1.4rem] leading-[1.55] text-fg">{lede}</p>
          </Reveal>
          <div className="mt-8 space-y-6">
            {rest.map((paragraph, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-pretty text-[16.5px] leading-[1.8] text-fg-2">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Aside — the last bay, held in view while the body scrolls */}
        <aside className="col-span-4 md:col-span-9 md:col-start-4 lg:col-span-3 lg:col-start-10">
          <Reveal className="lg:sticky lg:top-28">
            <div className="border-t border-line-2 pt-6">
              <div className="label">In her words</div>
              <blockquote className="serif mt-5 text-[1.45rem] leading-[1.4] text-fg italic">
                <span aria-hidden className="text-red-hi">&ldquo;</span>
                {about.pullQuote}
                <span aria-hidden className="text-red-hi">&rdquo;</span>
              </blockquote>
              <p className="label mt-6 !text-fg-2">{site.name}</p>
            </div>
          </Reveal>
        </aside>
      </div>
    </Section>
  );
}
