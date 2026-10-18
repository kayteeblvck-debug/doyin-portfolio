"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { about, contact, site } from "@/lib/content";
import { CONTAINER, GRID } from "@/components/ui/grid";
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

  // Entrance: each block settles in turn. The animate target is always set
  // (only the duration drops to zero for reduced motion) — removing it after
  // hydration would leave the block frozen at its initial, invisible state.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section id="top" className="relative z-10 flex min-h-[100svh] flex-col pt-[72px]">
      <div className={`${CONTAINER} flex flex-1 flex-col`}>
        <div className={`${GRID} flex-1 gap-y-10`}>
          {/* Copy — bays one and two */}
          <div className="col-span-4 flex flex-col justify-center pt-8 pb-12 md:col-span-7 md:pt-16 lg:pb-16">
            <motion.p {...enter(0.05)} className="label leading-relaxed">
              <span className="text-red-hi">{site.heroLabel}</span>
              <span aria-hidden className="mx-2 text-fg-4">
                —
              </span>
              {site.focus.map((item, i) => (
                // The space sits outside the no-wrap span so lines can break
                // between items, never inside one.
                <Fragment key={item}>
                  <span className="whitespace-nowrap">
                    {item}
                    {i < site.focus.length - 1 ? (
                      <span aria-hidden className="ml-1.5 text-fg-4">
                        ·
                      </span>
                    ) : null}
                  </span>{" "}
                </Fragment>
              ))}
            </motion.p>

            <h1 className="display mt-8 text-[clamp(3rem,8.4vw,7.4rem)] leading-[0.9] tracking-[-0.025em] uppercase">
              {site.nameWords.map((word, i) => (
                <motion.span
                  key={word}
                  className="block"
                  // Letters draw together from a wider set — no slide.
                  initial={{ opacity: 0, letterSpacing: "0.06em" }}
                  animate={{ opacity: 1, letterSpacing: "-0.025em" }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 1.4, delay: 0.15 + i * 0.12, ease: EASE }
                  }
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              {...enter(0.45)}
              className="serif mt-8 text-[1.65rem] leading-tight italic sm:text-[2rem]"
            >
              {site.motto}
            </motion.p>

            <motion.div {...enter(0.55)} className="mt-6 max-w-[34rem] space-y-4">
              {site.heroIntro.map((paragraph) => (
                <p key={paragraph} className="text-pretty text-[16.5px] leading-[1.7] text-fg-2">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <motion.div
              {...enter(0.65)}
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-4"
            >
              <LinkButton href="#experience">
                Explore my work
                <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </LinkButton>
              <ConnectMenu />
              {site.cv ? (
                <a
                  href={site.cv}
                  download
                  className="ink-link ml-3 inline-flex items-center gap-2 text-[14px] font-semibold"
                >
                  Download résumé
                  <IconArrowDown width={14} height={14} />
                </a>
              ) : null}
            </motion.div>
          </div>

          {/* Portrait — bays three and four */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 1.4, delay: 0.25, ease: EASE }}
            className="relative order-first col-span-4 h-[420px] sm:h-[520px] md:order-none md:col-span-5 md:h-auto md:min-h-[560px]"
          >
            <Portrait />
          </motion.div>
        </div>

        {/* Facts strip — four cells, one per bay */}
        <dl className={`${GRID} gap-y-6 border-t border-line py-6`}>
          {about.facts.map((fact) => (
            <div key={fact.label} className="col-span-2 md:col-span-3">
              <dt className="label">{fact.label}</dt>
              <dd className="mt-2 text-[15px] font-medium">{fact.value}</dd>
            </div>
          ))}
          {site.cv ? (
            <div className="col-span-2 md:col-span-3">
              <dt className="label">Résumé</dt>
              <dd className="mt-2">
                <a
                  href={site.cv}
                  download
                  className="ink-link inline-flex items-center gap-2 text-[15px] font-medium"
                >
                  Download PDF <IconArrowDown width={13} height={13} />
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}

/**
 * The portrait stands in a framed bay. The frame starts below the top of her
 * head so the figure breaks out of it; fine crop marks sit at its corners.
 */
function Portrait() {
  return (
    <div className="absolute inset-0 flex items-end">
      {/* Box sized to the image itself, so the frame can be placed relative to her */}
      <div className="relative aspect-[776/713] w-full">
        <div className="absolute inset-x-0 top-[17%] bottom-0 border border-b-0 border-line bg-gradient-to-b from-raised-2 to-bg">
          {/* Crop marks just outside the two upper corners */}
          <span aria-hidden className="absolute -top-px -left-[13px] h-px w-2 bg-line-3" />
          <span aria-hidden className="absolute -top-[13px] -left-px h-2 w-px bg-line-3" />
          <span aria-hidden className="absolute -top-px -right-[13px] h-px w-2 bg-line-3" />
          <span aria-hidden className="absolute -top-[13px] -right-px h-2 w-px bg-line-3" />
          {/* The single red stroke: a short segment on the frame's top edge */}
          <span aria-hidden className="absolute -top-px -left-px h-px w-10 bg-red-hi" />
        </div>

        <Image
          src="/adedoyin-omolola-portrait.png"
          alt={`${site.name}, ${site.role}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-contain object-bottom grayscale contrast-[1.06] [mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)]"
        />

        <span className="label absolute right-4 bottom-4 hidden !text-[10px] text-right md:block">
          {site.name}
          <br />
          <span className="!text-fg-4">{site.location}</span>
        </span>
      </div>
    </div>
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
        <IconPlus
          className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="connect-menu"
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
            className="absolute top-full left-0 z-30 mt-2 w-[19rem] border border-line-2 bg-raised"
          >
            {links.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 border-b border-line px-4 py-3.5 transition-colors duration-300 last:border-b-0 hover:bg-raised-2"
              >
                <Icon className="shrink-0 text-fg-3 transition-colors duration-300 group-hover:text-fg" />
                <span className="min-w-0 flex-1">
                  <span className="label block !text-[10px]">{label}</span>
                  <span className="mt-0.5 block truncate text-[14px] text-fg">{value}</span>
                </span>
                <IconArrowUpRight className="shrink-0 text-fg-4 transition-colors duration-300 group-hover:text-red-hi" />
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
