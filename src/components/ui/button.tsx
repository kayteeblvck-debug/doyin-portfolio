"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 *   solid    white button; turns red on hover
 *   line     outlined; fills slightly on hover
 */
type Variant = "solid" | "line";

const variants: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-red hover:text-white",
  line: "border border-line-3 text-fg hover:border-fg-3 hover:bg-white/[0.04]",
};

const shared =
  "group relative inline-flex h-12 items-center justify-center gap-2.5 rounded-md px-6 text-[15px] font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export function LinkButton({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
  download = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${shared} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
    </a>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return (
    <button className={`${shared} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
