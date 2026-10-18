"use client";

import type { ReactNode } from "react";

/** Square, 48px inputs on a slightly lifted ground; the border whitens on focus. */
const inputBase =
  "w-full rounded-md border bg-raised px-4 text-[15px] text-fg placeholder:text-fg-4 transition-colors duration-200 outline-none hover:border-line-3 focus:border-fg-3";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const noteId = `${htmlFor}-note`;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-[14px] font-medium text-fg">
          {label}
        </label>
        {optional ? <span className="text-[12.5px] text-fg-4">Optional</span> : null}
      </div>

      {children}

      {error ? (
        <p id={noteId} role="alert" className="mt-2 text-[13px] text-red-hi">
          {error}
        </p>
      ) : hint ? (
        <p id={noteId} className="tnum mt-2 text-right text-[12px] text-fg-4">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Class string for inputs. Pass `multiline` for a textarea. */
export function inputClass(error?: string, multiline = false) {
  return `${inputBase} ${error ? "border-red-hi" : "border-line-2"} ${
    multiline ? "resize-none py-3.5 leading-relaxed" : "h-12"
  }`;
}

/** aria-describedby value linking an input to its error/hint, if any. */
export function describedBy(htmlFor: string, error?: string, hint?: string) {
  return error || hint ? `${htmlFor}-note` : undefined;
}

/**
 * Honeypot. Hidden from people (and from screen readers via aria-hidden),
 * but present in the DOM for bots to fill in.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden
      className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
