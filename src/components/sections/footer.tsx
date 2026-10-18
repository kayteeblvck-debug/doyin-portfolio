"use client";

import { contact, navLinks, site } from "@/lib/content";
import { CONTAINER } from "@/components/ui/grid";
import { IconArrowUp } from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-band">
      <div className={`${CONTAINER} py-14`}>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display text-[1.25rem] uppercase">{site.name}</p>
            <p className="mt-2 text-[14.5px] text-fg-3">
              {site.role} · {site.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[14.5px] text-fg-2 transition-colors duration-200 hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 text-[14px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} ·{" "}
            <a href={`mailto:${contact.email}`} className="text-link hover:text-fg">
              {contact.email}
            </a>
          </p>
          <a href="#top" className="inline-flex items-center gap-2 font-semibold text-fg-2 hover:text-fg">
            Back to top <IconArrowUp width={13} height={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
