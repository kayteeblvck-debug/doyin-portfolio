"use client";

import { contact, navLinks, site } from "@/lib/content";
import { CONTAINER, GRID } from "@/components/ui/grid";
import { IconArrowDown, IconArrowUp, IconArrowUpRight } from "@/components/ui/icons";

/** Four columns, one per bay, then a single baseline row. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className={CONTAINER}>
        <div className={`${GRID} gap-y-12 py-16 md:py-20`}>
          <div className="col-span-4 md:col-span-3">
            <p className="display text-[1.6rem] leading-tight">{site.name}</p>
            <p className="mt-3 text-[14px] text-fg-3">
              {site.role}
              <br />
              {site.location}
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 md:col-span-3">
            <p className="label">Sections</p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[14px] text-fg-2 transition-colors duration-300 hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <p className="label">Contact</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a href={`mailto:${contact.email}`} className="text-[14px] break-all text-fg-2 transition-colors duration-300 hover:text-fg">
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[14px] text-fg-2 transition-colors duration-300 hover:text-fg"
                >
                  LinkedIn <IconArrowUpRight width={12} height={12} />
                </a>
              </li>
              {site.cv ? (
                <li>
                  <a
                    href={site.cv}
                    download
                    className="inline-flex items-center gap-1.5 text-[14px] text-fg-2 transition-colors duration-300 hover:text-fg"
                  >
                    Résumé <IconArrowDown width={12} height={12} />
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-3">
            <p className="label">Motto</p>
            <p className="serif mt-5 text-[1.25rem] leading-snug italic">{site.motto}</p>
          </div>
        </div>

        <div className={`${GRID} items-center gap-y-3 border-t border-line py-6`}>
          <p className="col-span-4 text-[12.5px] text-fg-3 md:col-span-6">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="col-span-4 md:col-span-6 md:text-right">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-fg-2 transition-colors duration-300 hover:text-fg"
            >
              Back to top <IconArrowUp width={12} height={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
