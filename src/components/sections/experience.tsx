"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { roles, sections, type Role } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { EASE, Reveal } from "@/components/ui/reveal";
import { IconPlus } from "@/components/ui/icons";
import { useMediaQuery } from "@/lib/media";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Large screens: roles as vertical tabs on the left, the selected role on the right.
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
    <Section id="experience" band>
      <SectionHead {...sections.experience} />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div
            role={wide ? "tablist" : undefined}
            aria-orientation={wide ? "vertical" : undefined}
            aria-label={wide ? "Roles" : undefined}
            onKeyDown={wide ? onKeyDown : undefined}
            className="space-y-2"
          >
            {roles.map((role, i) => {
              const isOn = wide ? selected === i : expanded === i;
              return (
                <div
                  key={role.title}
                  className={`overflow-hidden rounded-lg border transition-colors duration-200 ${
                    isOn ? "border-line-3 bg-raised-2" : "border-line-2 bg-raised hover:border-line-3"
                  }`}
                >
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
                    className="relative flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                  >
                    {isOn ? (
                      <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r bg-red-hi" />
                    ) : null}
                    <span className="min-w-0">
                      <span className="tnum block text-[13px] font-medium text-fg-3">{role.period}</span>
                      <span className="mt-1 block text-[16px] leading-snug font-semibold">{role.title}</span>
                      <span className="mt-0.5 block text-[14.5px] text-fg-2">{role.organisation}</span>
                    </span>
                    {!wide ? (
                      <IconPlus
                        className={`mt-1 shrink-0 text-fg-3 transition-transform duration-200 ${isOn ? "rotate-45" : ""}`}
                      />
                    ) : null}
                  </button>

                  {!wide ? (
                    <div id={`role-detail-${i}`}>
                      <AnimatePresence initial={false}>
                        {isOn ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-line-2 px-5 pt-5 pb-6">
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

        {wide ? (
          <div
            id="role-panel"
            role="tabpanel"
            aria-labelledby={`role-tab-${selected}`}
            tabIndex={0}
            className="col-span-7 outline-none"
          >
            <div className="sticky top-24 rounded-lg border border-line-2 bg-raised p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
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
    <article>
      {!compact ? (
        <>
          <p className="text-[13.5px] font-semibold text-red-hi">{role.domain}</p>
          <h3 className="display mt-2 text-[1.75rem]">{role.title}</h3>
          <p className="mt-1.5 text-[15.5px] text-fg-2">
            {role.organisation}
            {role.place ? ` · ${role.place}` : ""}
            <span className="text-fg-4"> · </span>
            <span className="tnum text-fg-3">{role.period}</span>
          </p>
        </>
      ) : (
        <p className="text-[13.5px] font-semibold text-red-hi">
          {role.domain}
          {role.place ? <span className="font-normal text-fg-3"> · {role.place}</span> : null}
        </p>
      )}

      <p className={`text-pretty leading-[1.65] text-fg ${compact ? "mt-3 text-[16px]" : "mt-5 text-[17px]"}`}>
        {role.summary}
      </p>

      <ul className="mt-5 space-y-3">
        {role.work.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15.5px] leading-[1.65] text-fg-2">
            <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-red-hi" />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-2">
        {role.skills.map((skill) => (
          <li key={skill} className="rounded-md border border-line-2 bg-raised-2 px-3 py-1.5 text-[13.5px] text-fg-2">
            {skill}
          </li>
        ))}
      </ul>
    </article>
  );
}
