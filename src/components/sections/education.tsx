"use client";

import { education, sections } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * A three-column register aligned to the bays:
 * period (col 1) · qualification (col 4) · institution and result (col 7–12).
 */
export function Education() {
  return (
    <Section id="education">
      <SectionHead {...sections.education} />

      {/* Column heads — large screens only */}
      <div className={`${GRID} hidden pb-4 md:grid`}>
        <span className="label md:col-span-3">Period</span>
        <span className="label md:col-span-3">Qualification</span>
        <span className="label md:col-span-6">Institution &amp; result</span>
      </div>

      <ol className="border-b border-line">
        {education.map((item, i) => (
          <li key={item.award}>
            <Reveal delay={0.06 * i} className={`${GRID} gap-y-3 border-t border-line py-8`}>
              <span className="label tnum col-span-4 pt-1.5 !tracking-[0.12em] md:col-span-3">
                {item.period}
              </span>
              <h3 className="display col-span-4 text-[1.75rem] md:col-span-3">{item.award}</h3>
              <div className="col-span-4 md:col-span-6">
                <p className="text-[15.5px] font-semibold text-fg">{item.school}</p>
                <p className="mt-1.5 text-[15px] text-fg-2">{item.grade}</p>
                {item.detail ? (
                  <p className="text-pretty mt-3 max-w-[34rem] text-[14px] leading-relaxed text-fg-3">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
