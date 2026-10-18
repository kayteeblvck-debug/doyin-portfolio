"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contact, sections, site } from "@/lib/content";
import { Section, SectionHead } from "@/components/ui/section";
import { EASE, Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { describedBy, Field, Honeypot, inputClass } from "@/components/ui/field";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconLinkedIn,
  IconMail,
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

export function Contact() {
  const lines = [
    { term: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: IconMail },
    { term: "LinkedIn", value: "Adedoyin Omolola", href: contact.linkedin, Icon: IconLinkedIn, external: true },
    ...(site.cv
      ? [{ term: "Résumé", value: "Download PDF", href: site.cv, Icon: IconArrowDown, download: true }]
      : []),
  ];

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHead {...sections.contact} />
          <Reveal>
            <ul className="space-y-3">
              {lines.map(({ term, value, href, Icon, external, download }) => (
                <li key={term}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...(download ? { download: true } : {})}
                    className="group flex items-center gap-4 rounded-lg border border-line-2 bg-raised px-5 py-4 transition-colors duration-200 hover:border-line-3"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-raised-2 text-fg-2 group-hover:text-fg">
                      <Icon width={18} height={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] text-fg-3">{term}</span>
                      <span className="block truncate text-[15.5px] font-semibold">{value}</span>
                    </span>
                    <IconArrowUpRight className="shrink-0 text-fg-4 transition-colors duration-200 group-hover:text-red-hi" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14.5px] text-fg-3">Based in {site.location}</p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <div className="rounded-lg border border-line-2 bg-raised p-6 sm:p-8">
            <ContactForm />
          </div>
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
        className="py-4"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full border border-line-3 text-red-hi">
          <IconCheck width={18} height={18} />
        </span>
        <p className="display mt-6 text-[2rem]">Message sent.</p>
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
          className="text-link mt-6 text-[15px] font-semibold"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const noteId = "contact-reason-note";

  return (
    <form onSubmit={submit} className="relative">
      <Honeypot value={form.website} onChange={(v) => set("website", v)} />

      {/* Name and email side by side */}
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

      {/* Reason — a 3 × 2 grid of options, the same width as the fields above */}
      <div className="mt-7">
        <span id="contact-reason-label" className="mb-2 block text-[14px] font-medium">
          Reason for contact
        </span>
        <div
          role="group"
          aria-labelledby="contact-reason-label"
          className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-2 bg-line-2 sm:grid-cols-3"
        >
          {REASONS.map((reason) => {
            const active = form.reason === reason;
            return (
              <button
                key={reason}
                type="button"
                aria-pressed={active}
                onClick={() => set("reason", reason)}
                className={`relative flex h-12 items-center justify-center px-3 text-center text-[14px] font-semibold transition-colors duration-200 ${
                  active ? "bg-fg text-bg" : "bg-raised-2 text-fg-2 hover:bg-[#222] hover:text-fg"
                }`}
              >
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
          <a href={`mailto:${contact.email}`} className="text-link text-fg-2 hover:text-fg">
            {contact.email}
          </a>
        </p>
      </div>
    </form>
  );
}
