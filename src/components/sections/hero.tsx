"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { about, contact, site } from "@/lib/content";
import { CONTAINER } from "@/components/ui/grid";
import { EASE } from "@/components/ui/reveal";
import { Button, LinkButton } from "@/components/ui/button";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUpRight,
  IconLinkedIn,
  IconMail,
  IconPlus,
} from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion";

export function Hero() {
  const reduced = useReducedMotion();

  // The animate target is always set; only the duration drops for reduced
  // motion, so nothing can be left frozen at its initial, hidden state.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section id="top" className="pt-[104px] pb-20 md:pt-[136px] md:pb-24">
      <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-10`}>
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.p {...enter(0)} className="text-[14.5px] leading-relaxed font-medium text-fg-2">
            <span className="font-semibold text-red-hi">{site.heroLabel}</span>
            <span aria-hidden className="mx-2 text-fg-4">|</span>
            {site.focus.map((item, i) => (
              // Separators stay attached to the item before them, so a
              // wrapped line never starts with a dot.
              <Fragment key={item}>
                <span className="whitespace-nowrap">
                  {item}
                  {i < site.focus.length - 1 ? <span aria-hidden className="text-fg-4"> ·</span> : null}
                </span>{" "}
              </Fragment>
            ))}
          </motion.p>

          <motion.h1
            {...enter(0.08)}
            className="display mt-5 text-[clamp(2.8rem,7vw,5.25rem)] leading-[0.98] font-extrabold tracking-[-0.025em] uppercase"
          >
            {site.nameWords.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.p {...enter(0.16)} className="mt-6 text-[1.4rem] leading-snug font-semibold sm:text-[1.6rem]">
            {site.motto}
          </motion.p>

          <motion.div {...enter(0.22)} className="mt-5 max-w-[36rem] space-y-4">
            {site.heroIntro.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-[17px] leading-[1.7] text-fg-2">
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div {...enter(0.28)} className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="#experience">
              Explore my work
              <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </LinkButton>
            <ConnectMenu />
            {site.cv ? (
              <a
                href={site.cv}
                download
                className="text-link ml-2 inline-flex items-center gap-2 text-[15px] font-semibold"
              >
                Download résumé <IconArrowDown width={14} height={14} />
              </a>
            ) : null}
          </motion.div>
        </div>

        {/* Framed portrait with her details underneath */}
        <motion.figure {...enter(0.12)} className="mx-auto w-full max-w-[400px] lg:col-span-5 lg:mr-0">
          <div className="rounded-lg border border-line-2 bg-raised p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-raised-2">
              <Image
                src={site.photo}
                alt={`${site.name}, ${site.role}`}
                fill
                priority
                sizes="(max-width: 1024px) 400px, 400px"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <dl className="mt-3 divide-y divide-line px-2">
              {about.facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-[13.5px] text-fg-3">{fact.label}</dt>
                  <dd className="text-right text-[14px] font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}

/** "Let's connect" opens straight onto her two direct lines. */
function ConnectMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const links = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: IconMail, external: false },
    { label: "LinkedIn", value: "Adedoyin Omolola", href: contact.linkedin, Icon: IconLinkedIn, external: true },
  ];

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="line"
        aria-expanded={open}
        aria-controls="connect-menu"
        onClick={() => setOpen((v) => !v)}
      >
        Let&rsquo;s connect
        <IconPlus className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`} />
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="connect-menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            className="absolute top-full left-0 z-30 mt-2 w-[18.5rem] overflow-hidden rounded-lg border border-line-2 bg-raised shadow-2xl shadow-black/50"
          >
            {links.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 hover:bg-raised-2"
              >
                <Icon width={18} height={18} className="shrink-0 text-fg-3 group-hover:text-fg" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-fg-3">{label}</span>
                  <span className="block truncate text-[14.5px] font-medium">{value}</span>
                </span>
                <IconArrowUpRight className="shrink-0 text-fg-4 group-hover:text-red-hi" />
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
