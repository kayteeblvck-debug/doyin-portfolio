"use client";

import { metrics, sections } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/** Four figures, one per bay, each set flush to its guide line. */
export function Metrics() {
  const { footnote, ...head } = sections.metrics;

  return (
    <Section id="metrics">
      <SectionHead {...head} />

      <div className={`${GRID} gap-y-12`}>
        {metrics.map((metric, i) => {
          const figure = metric.display.replace(/\+$/, "");
          const plus = metric.display.endsWith("+");
          return (
            <Reveal
              key={metric.label}
              delay={0.07 * i}
              className="col-span-2 border-t border-line-2 pt-6 md:col-span-3"
            >
              <p className="display tnum text-[4.2rem] leading-none sm:text-[5.25rem]">
                {figure}
                {plus ? <span className="text-red-hi">+</span> : null}
              </p>
              <p className="mt-6 text-[15px] font-semibold">{metric.label}</p>
              <p className="text-pretty mt-1.5 text-[14px] leading-relaxed text-fg-3">
                {metric.note}
              </p>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <p className="label mt-14 !tracking-[0.14em] !normal-case !text-[12px] !font-medium">
          {footnote}
        </p>
      </Reveal>
    </Section>
  );
}
