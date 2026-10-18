"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact, navLinks, site } from "@/lib/content";
import { CONTAINER } from "@/components/ui/grid";
import { IconArrowDown } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion";

/** Highlights whichever section currently owns the upper part of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState("");

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
    for (const id of ["top", ...navLinks.map((l) => l.href.slice(1))]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, return focus on close.
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? "bg-bg/90 shadow-[0_1px_0_0_var(--line)] backdrop-blur-md" : ""
        }`}
      >
        <nav aria-label="Primary" className={`${CONTAINER} flex h-[72px] items-center justify-between gap-8`}>
          <a href="#top" className="display text-[17px] tracking-[-0.01em] uppercase">
            {site.name}
          </a>

          <div className="flex items-center gap-8">
            <ul className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`text-[14.5px] font-medium transition-colors duration-200 ${
                        isActive ? "text-fg" : "text-fg-3 hover:text-fg"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {site.cv ? (
              <a
                href={site.cv}
                download
                className="hidden h-10 items-center gap-2 rounded-md border border-line-3 px-4 text-[14px] font-semibold transition-colors duration-200 hover:border-fg-3 hover:bg-white/[0.04] sm:inline-flex"
              >
                Résumé <IconArrowDown width={14} height={14} />
              </a>
            ) : null}

            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-md border border-line-3 lg:hidden"
            >
              <span aria-hidden className="relative block h-3 w-[18px]">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ${
                    open ? "top-[5px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-fg transition-transform duration-300 ${
                    open ? "top-[5px] -rotate-45" : "top-[10px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

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
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-[72px] lg:hidden"
          >
            <div className={`${CONTAINER} flex min-h-full flex-col pt-6 pb-10`}>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="display block py-3 text-[2rem]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-2 pt-10 text-[15px] text-fg-2">
                <a href={`mailto:${contact.email}`} className="text-link block w-fit">
                  {contact.email}
                </a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-link block w-fit">
                  LinkedIn
                </a>
                {site.cv ? (
                  <a href={site.cv} download className="text-link block w-fit">
                    Download résumé
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
