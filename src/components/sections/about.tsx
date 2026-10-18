"use client";

import { about, site } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <Section id="about" band>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <SectionHead eyebrow={about.eyebrow} heading={about.heading} />
          <Reveal className="-mt-2 space-y-5">
            {about.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-pretty text-[17px] leading-[1.75] text-fg-2">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <aside className="lg:col-span-5 lg:pt-[7.5rem]">
          <Reveal className="lg:sticky lg:top-28">
            <blockquote className="rounded-lg border border-line-2 bg-raised p-8">
              <span aria-hidden className="display block text-[3.5rem] leading-[0.6] text-red-hi">
                &ldquo;
              </span>
              <p className="mt-4 text-[1.35rem] leading-[1.45] font-semibold">{about.pullQuote}</p>
              <footer className="mt-6 text-[14px] text-fg-3">— {site.name}</footer>
            </blockquote>
          </Reveal>
        </aside>
      </div>
    </Section>
  );
}
