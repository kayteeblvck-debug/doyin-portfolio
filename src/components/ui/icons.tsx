import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Thin, square-ended strokes to match the hairline rules. */
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2.5 8h10.5M9 4l4 4-4 4" />
  </svg>
);

export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
);

export const IconArrowDown = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 2.5v10.5M4 9l4 4 4-4" />
  </svg>
);

export const IconArrowUp = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 13.5V3M4 7l4-4 4 4" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 8.5l3.2 3L13 4.5" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2 3.5h12v9H2z" />
    <path d="M2.5 4l5.5 4.5L13.5 4" />
  </svg>
);

export const IconLinkedIn = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2.5 2.5h11v11h-11z" />
    <path d="M5.25 7v4M5.25 5v.01M7.75 11V7M7.75 8.75c0-1 .75-1.75 1.75-1.75s1.75.75 1.75 1.75V11" />
  </svg>
);
