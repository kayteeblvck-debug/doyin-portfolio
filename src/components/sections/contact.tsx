"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contact, sections, site } from "@/lib/content";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { EASE, Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { describedBy, Field, Honeypot, inputClass } from "@/components/ui/field";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
} from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion";

const OTHER = "Other";

/** Six reasons, so the selector is an exact 3 × 2 grid. */
const REASONS = [
  "Training contract",
  "Paralegal role",
  "Legal support",
  "Pro bono",
  "Collaboration",
  OTHER,
] as const;

type FormState = {
  name: string;
  email: string;
  reason: string;
  message: string;
  website: string; // honeypot
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  reason: REASONS[0],
  message: "",
  website: "",
};

/**
 * Bay one: margin label · bay two: direct lines · bays three–four: the form.
 */
export function Contact() {
  const lines = [
    { term: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: IconArrowUpRight },
    { term: "LinkedIn", value: "Adedoyin Omolola", href: contact.linkedin, Icon: IconArrowUpRight, external: true },
    ...(site.cv
      ? [{ term: "Résumé", value: "Download PDF", href: site.cv, Icon: IconArrowDown, download: true }]
      : []),
  ];

  return (
    <Section id="contact">
      <SectionHead {...sections.contact} />

      <div className={`${GRID} gap-y-14`}>
        <Reveal className="col-span-4 md:col-span-3">
          <p className="label">Direct lines</p>
        </Reveal>

        <Reveal className="col-span-4 md:col-span-9 lg:col-span-3" delay={0.05}>
          <ul className="border-b border-line">
            {lines.map(({ term, value, href, Icon, external, download }) => (
              <li key={term} className="border-t border-line">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(download ? { download: true } : {})}
                  className="group flex items-end justify-between gap-4 py-5"
                >
                  <span className="min-w-0">
                    <span className="label block">{term}</span>
                    <span className="mt-2 block truncate text-[15px] font-medium text-fg transition-colors duration-300 group-hover:text-white">
                      {value}
                    </span>
                  </span>
                  <Icon className="mb-1 shrink-0 text-fg-3 transition-colors duration-300 group-hover:text-red-hi" />
                </a>
              </li>
            ))}
            <li className="border-t border-line py-5">
              <span className="label block">Based in</span>
              <span className="mt-2 block text-[15px] font-medium text-fg-2">{site.location}</span>
            </li>
          </ul>
        </Reveal>

        <Reveal className="col-span-4 md:col-span-9 md:col-start-4 lg:col-span-6 lg:col-start-7" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function ContactForm() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [customReason, setCustomReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const isOther = form.reason === OTHER;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setNotice(null);

    const payload = {
      ...form,
      reason: isOther ? customReason.trim() || OTHER : form.reason,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.fields ?? {});
        setNotice(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setNotice("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
        role="status"
        className="border-t border-line-2 pt-8"
      >
        <span className="grid h-11 w-11 place-items-center border border-line-2 text-red-hi">
          <IconCheck width={18} height={18} />
        </span>
        <p className="display mt-8 text-[2.6rem]">Message sent.</p>
        <p className="text-pretty mt-4 max-w-md text-[16px] leading-relaxed text-fg-2">
          Thanks for reaching out — it has landed in my inbox and I will reply to you directly.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM);
            setCustomReason("");
            setStatus("idle");
          }}
          className="ink-link mt-8 text-[14px] font-semibold"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const noteId = "contact-reason-note";

  return (
    <form onSubmit={submit} className="relative border-t border-line-2 pt-8">
      <Honeypot value={form.website} onChange={(v) => set("website", v)} />

      {/* Two fields, each one bay wide — their edges fall on the 7 and 10 lines */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 sm:gap-x-6">
        <Field label="Name" htmlFor="contact-name" error={errors.name}>
          <input
            id="contact-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            maxLength={80}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("contact-name", errors.name)}
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="Email" htmlFor="contact-email" error={errors.email}>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("contact-email", errors.email)}
            className={inputClass(errors.email)}
          />
        </Field>
      </div>

      {/* Reason — a 3 × 2 grid of tabs sharing one hairline, flush with the fields */}
      <div className="mt-7">
        <span id="contact-reason-label" className="label mb-2.5 block !text-fg-2">
          Reason for contact
        </span>
        <div
          role="group"
          aria-labelledby="contact-reason-label"
          className="grid grid-cols-2 gap-px border border-line-2 bg-line-2 sm:grid-cols-3"
        >
          {REASONS.map((reason) => {
            const active = form.reason === reason;
            return (
              <button
                key={reason}
                type="button"
                aria-pressed={active}
                onClick={() => set("reason", reason)}
                className={`relative flex h-12 items-center px-4 text-left text-[13.5px] font-semibold transition-colors duration-300 ${
                  active ? "bg-fg text-bg" : "bg-raised text-fg-2 hover:bg-raised-2 hover:text-fg"
                }`}
              >
                {active ? (
                  <span aria-hidden className="absolute top-0 left-0 h-full w-[3px] bg-red" />
                ) : null}
                {reason}
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {isOther ? (
            <motion.div
              key="custom-reason"
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <input
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Tell me in a few words"
                maxLength={120}
                aria-label="Custom reason for contact"
                aria-invalid={errors.reason ? true : undefined}
                aria-describedby={errors.reason ? noteId : undefined}
                className={`${inputClass(errors.reason)} mt-3`}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {errors.reason ? (
          <p id={noteId} role="alert" className="mt-2 text-[13px] text-red-hi">
            {errors.reason}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        <Field
          label="Message"
          htmlFor="contact-message"
          error={errors.message}
          hint={`${form.message.length} / 4000`}
        >
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="What are you working on, and how can I help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy(
              "contact-message",
              errors.message,
              `${form.message.length} / 4000`,
            )}
            className={inputClass(errors.message, true)}
          />
        </Field>
      </div>

      {notice ? (
        <p role="alert" className="mt-6 text-[14px] text-red-hi">
          {notice}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Let’s talk"}
          {status === "sending" ? null : (
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </Button>
        <p className="text-[13.5px] text-fg-3">
          Or write to{" "}
          <a href={`mailto:${contact.email}`} className="ink-link text-fg-2 hover:text-fg">
            {contact.email}
          </a>
        </p>
      </div>
    </form>
  );
}
