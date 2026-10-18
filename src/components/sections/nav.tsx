"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact, navLinks, sectionIndex, site } from "@/lib/content";
import { CONTAINER, GRID } from "@/components/ui/grid";
import { EASE } from "@/components/ui/reveal";
import { IconArrowDown, IconArrowUpRight } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion";

/** Tracks which numbered section currently owns the upper part of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );
    for (const { id } of sectionIndex) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    // Clear the marker when back over the hero
    const top = document.getElementById("top");
    const heroObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(""),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    if (top) heroObserver.observe(top);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  return active;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu sheet: lock scroll, close on Escape, hand focus back on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const current = sectionIndex.find((s) => s.id === active);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled || open
            ? "border-line bg-bg/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Primary" className={CONTAINER}>
          <div className={`${GRID} h-[72px] items-center`}>
            {/* Name — first bay */}
            <a
              href="#top"
              className="col-span-3 flex flex-col leading-none md:col-span-3"
            >
              <span className="display text-[19px] tracking-[-0.01em]">{site.name}</span>
              <span className="label mt-1.5 !text-[9.5px] !tracking-[0.24em]">
                {site.role}
              </span>
            </a>

            {/* Links — start exactly on column 4, the same edge as every heading */}
            <ul className="hidden h-full items-stretch gap-7 md:col-span-7 lg:flex xl:gap-9">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href} className="relative flex">
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center text-[13.5px] font-medium transition-colors duration-300 ${
                        isActive ? "text-fg" : "text-fg-3 hover:text-fg"
                      }`}
                    >
                      {link.label}
                    </a>
                    {/* Active marker sits on the bar's bottom edge */}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-px h-px origin-left bg-red-hi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>

            {/* Right edge: résumé + menu */}
            <div className="col-span-1 flex items-center justify-end gap-3 md:col-span-9 lg:col-span-2">
              {site.cv ? (
                <a
                  href={site.cv}
                  download
                  className="hidden h-9 items-center gap-2 border border-line-2 px-3.5 text-[12.5px] font-semibold text-fg transition-colors duration-300 hover:border-fg sm:inline-flex"
                >
                  Résumé
                  <IconArrowDown width={13} height={13} />
                </a>
              ) : null}

              <button
                ref={menuButton}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                className="flex h-9 items-center gap-3 text-[12.5px] font-semibold text-fg lg:hidden"
              >
                <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
                <span aria-hidden className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-300 ${
                      open ? "top-1.5 rotate-45" : "top-0.5"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-300 ${
                      open ? "top-1.5 -rotate-45" : "top-2.5"
                    }`}
                  />
                </span>
                <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile / tablet menu sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-[72px] lg:hidden"
          >
            <div className={`${CONTAINER} flex min-h-full flex-col pb-10`}>
              <ul className="border-t border-line">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: EASE }}
                    className="border-b border-line"
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`${GRID} items-baseline py-5`}
                    >
                      <span className="label tnum col-span-1 !text-red-hi md:col-span-3">
                        {link.number}
                      </span>
                      <span className="display col-span-3 text-[2.1rem] md:col-span-9">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className={`${GRID} mt-auto gap-y-6 pt-12`}>
                <div className="col-span-4 md:col-span-6">
                  <div className="label">Email</div>
                  <a href={`mailto:${contact.email}`} className="ink-link mt-2 inline-block text-[15px]">
                    {contact.email}
                  </a>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <div className="label">LinkedIn</div>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-link mt-2 inline-flex items-center gap-1.5 text-[15px]"
                  >
                    Profile <IconArrowUpRight width={13} height={13} />
                  </a>
                </div>
                {site.cv ? (
                  <div className="col-span-2 md:col-span-3">
                    <div className="label">Résumé</div>
                    <a href={site.cv} download className="ink-link mt-2 inline-flex items-center gap-1.5 text-[15px]">
                      Download <IconArrowDown width={13} height={13} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Running section counter, bottom-right on large screens */}
      <div
        aria-hidden
        className={`pointer-events-none fixed right-0 bottom-0 z-40 hidden transition-opacity duration-500 lg:block ${
          current ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 border-t border-l border-line bg-bg/85 px-5 py-3 backdrop-blur-md">
          <span className="label tnum !text-red-hi">{current?.number ?? "00"}</span>
          <span className="label !text-fg-2">{current?.label ?? ""}</span>
          <span className="label tnum !text-fg-4">/ 08</span>
        </div>
      </div>
    </>
  );
}
