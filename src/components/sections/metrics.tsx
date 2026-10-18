"use client";

import { metrics, sections } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Metrics() {
  const { footnote, ...head } = sections.metrics;

  return (
    <Section id="metrics">
      <SectionHead {...head} />

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const figure = metric.display.replace(/\+$/, "");
          const plus = metric.display.endsWith("+");
          return (
            <Reveal key={metric.label} delay={0.05 * i} className="rounded-lg border border-line-2 bg-raised p-6 sm:p-7">
              <p className="display tnum text-[2.75rem] leading-none font-extrabold sm:text-[3.25rem]">
                {figure}
                {plus ? <span className="text-red-hi">+</span> : null}
              </p>
              <p className="mt-4 text-[15.5px] font-semibold">{metric.label}</p>
              <p className="text-pretty mt-1 text-[14px] leading-relaxed text-fg-3">{metric.note}</p>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 text-[14px] text-fg-3">{footnote}</p>
    </Section>
  );
}
