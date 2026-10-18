"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { roles, sections, type Role } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { EASE, Reveal } from "@/components/ui/reveal";
import { IconArrowRight, IconPlus } from "@/components/ui/icons";
import { useMediaQuery } from "@/lib/media";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Large screens: a vertical tab list in bays one–two and the selected role in
 * bays three–four, starting on the column-7 guide line.
 * Smaller screens: the same list becomes an accordion.
 */
export function Experience() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = roles.length - 1;
    const next =
      e.key === "ArrowDown" ? (selected === last ? 0 : selected + 1)
      : e.key === "ArrowUp" ? (selected === 0 ? last : selected - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="experience">
      <SectionHead {...sections.experience} />

      <div className={GRID}>
        <Reveal className="col-span-4 md:col-span-12 lg:col-span-6">
          <div
            role={wide ? "tablist" : undefined}
            aria-orientation={wide ? "vertical" : undefined}
            aria-label={wide ? "Roles" : undefined}
            onKeyDown={wide ? onKeyDown : undefined}
            className="border-b border-line"
          >
            {roles.map((role, i) => {
              const isOn = wide ? selected === i : expanded === i;
              return (
                <div key={role.title} className="relative border-t border-line">
                  <span
                    aria-hidden
                    className={`absolute -top-px left-0 h-px w-full origin-left bg-red-hi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOn ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <button
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    id={`role-tab-${i}`}
                    {...(wide
                      ? {
                          role: "tab",
                          "aria-selected": isOn,
                          "aria-controls": "role-panel",
                          tabIndex: isOn ? 0 : -1,
                          onClick: () => setSelected(i),
                        }
                      : {
                          "aria-expanded": isOn,
                          "aria-controls": `role-detail-${i}`,
                          onClick: () => setExpanded(isOn ? null : i),
                        })}
                    className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2 py-5 text-left sm:grid-cols-[10rem_1fr_auto]"
                  >
                    <span className="label tnum col-span-2 pt-[3px] !tracking-[0.1em] whitespace-nowrap sm:col-span-1">{role.period}</span>
                    <span className="min-w-0">
                      <span
                        className={`block text-[15.5px] leading-snug font-semibold transition-colors duration-300 ${
                          isOn ? "text-fg" : "text-fg-2 group-hover:text-fg"
                        }`}
                      >
                        {role.title}
                      </span>
                      <span className="mt-1 block text-[13.5px] text-fg-3">
                        {role.organisation}
                      </span>
                    </span>
                    <span className="pt-0.5 text-fg-3">
                      {wide ? (
                        <IconArrowRight
                          className={`transition-all duration-300 ${
                            isOn ? "text-red-hi opacity-100" : "opacity-0 group-hover:opacity-60"
                          }`}
                        />
                      ) : (
                        <IconPlus
                          className={`transition-transform duration-300 ${isOn ? "rotate-45 text-fg" : ""}`}
                        />
                      )}
                    </span>
                  </button>

                  {/* Accordion body (small screens) */}
                  {!wide ? (
                    <div id={`role-detail-${i}`}>
                      <AnimatePresence initial={false}>
                        {isOn ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pb-8">
                              <RoleDetail role={role} compact />
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Selected role (large screens) — starts on the column-7 line */}
        {wide ? (
          <div
            id="role-panel"
            role="tabpanel"
            aria-labelledby={`role-tab-${selected}`}
            tabIndex={0}
            className="col-span-6 col-start-7 outline-none"
          >
            <div className="sticky top-28">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                >
                  <RoleDetail role={roles[selected]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function RoleDetail({ role, compact = false }: { role: Role; compact?: boolean }) {
  return (
    <article className={compact ? "" : "border-t border-line-2 pt-6"}>
      {!compact ? (
        <>
          <div className="flex items-baseline justify-between gap-6">
            <span className="label !text-red-hi">{role.domain}</span>
            <span className="label tnum">{role.period}</span>
          </div>
          <h3 className="display mt-6 text-[2.2rem]">{role.title}</h3>
          <p className="mt-3 text-[15px] text-fg-2">
            {role.organisation}
            {role.place ? <span className="text-fg-3"> · {role.place}</span> : null}
          </p>
        </>
      ) : (
        <span className="label !text-red-hi">
          {role.domain}
          {role.place ? <span className="!text-fg-3"> · {role.place}</span> : null}
        </span>
      )}

      <p className={`serif text-pretty leading-[1.5] text-fg italic ${compact ? "mt-4 text-[1.15rem]" : "mt-7 text-[1.3rem]"}`}>
        {role.summary}
      </p>

      <div className="label mt-9">Key work</div>
      <ol className="mt-3 border-t border-line">
        {role.work.map((item, i) => (
          <li
            key={i}
            className="grid grid-cols-[2.25rem_1fr] border-b border-line py-4 text-[15px] leading-[1.7] text-fg-2"
          >
            <span className="tnum pt-[3px] text-[12px] font-semibold text-fg-4">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ol>

      <div className="label mt-9">Skills</div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {role.skills.map((skill) => (
          <li
            key={skill}
            className="flex h-8 items-center border border-line-2 px-3 text-[13px] text-fg-2"
          >
            {skill}
          </li>
        ))}
      </ul>
    </article>
  );
}
