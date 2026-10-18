"use client";

import { education, sections } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Education() {
  return (
    <Section id="education" band>
      <SectionHead {...sections.education} />

      <ol className="space-y-4">
        {education.map((item, i) => (
          <li key={item.award}>
            <Reveal
              delay={0.05 * i}
              className="grid gap-x-8 gap-y-2 rounded-lg border border-line-2 bg-raised p-6 sm:p-7 md:grid-cols-[10rem_1fr_auto] md:items-baseline"
            >
              <span className="tnum text-[14px] font-semibold text-fg-3">{item.period}</span>
              <div>
                <h3 className="display text-[1.3rem]">{item.award}</h3>
                <p className="mt-1 text-[15.5px] text-fg-2">{item.school}</p>
                {item.detail ? (
                  <p className="text-pretty mt-2 text-[14.5px] leading-relaxed text-fg-3">{item.detail}</p>
                ) : null}
              </div>
              <p className="text-[15px] font-semibold md:max-w-[18rem] md:text-right">{item.grade}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
