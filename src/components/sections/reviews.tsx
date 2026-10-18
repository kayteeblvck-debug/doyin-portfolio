"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { sections } from "@/lib/content";
import type { Review } from "@/lib/types";
import { GRID } from "@/components/ui/grid";
import { Section, SectionHead } from "@/components/ui/section";
import { EASE, Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Field, Honeypot, describedBy, inputClass } from "@/components/ui/field";
import { IconArrowRight, IconCheck, IconPlus } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion";

type FormState = {
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  anonymous: boolean;
  website: string; // honeypot
};

const EMPTY_FORM: FormState = {
  name: "",
  role: "",
  company: "",
  rating: 5,
  message: "",
  anonymous: false,
  website: "",
};

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const reduced = useReducedMotion();

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { reviews: Review[] };
      setReviews(data.reviews ?? []);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdded = (review: Review | null) => {
    if (review) setReviews((current) => [review, ...current]);
    setFormOpen(false);
  };

  return (
    <Section id="reviews">
      <SectionHead
        {...sections.reviews}
        aside={
          <Button
            type="button"
            variant="line"
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            aria-controls="review-form-panel"
          >
            {formOpen ? "Close" : "Leave a review"}
            <IconPlus className={`transition-transform duration-300 ${formOpen ? "rotate-45" : ""}`} />
          </Button>
        }
      />

      {/* Form — opens above the reviews, set in bays two to four */}
      <div id="review-form-panel" className={GRID}>
        <div className="col-span-4 md:col-span-9 md:col-start-4">
          <AnimatePresence initial={false}>
            {formOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="pb-20">
                  <ReviewForm onAdded={handleAdded} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <div aria-busy aria-label="Loading reviews" className={`${GRID} gap-y-10`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="col-span-4 border-t border-line-2 pt-6 md:col-span-6 lg:col-span-3">
              <div className="h-2.5 w-20 animate-pulse bg-line" />
              <div className="mt-6 space-y-3">
                <div className="h-3 w-full animate-pulse bg-line" />
                <div className="h-3 w-11/12 animate-pulse bg-line" />
                <div className="h-3 w-2/3 animate-pulse bg-line" />
              </div>
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className={GRID}>
          <div className="col-span-4 border-t border-line-2 pt-6 md:col-span-9 md:col-start-4">
            <p className="text-[16px] text-fg-2">Reviews could not be loaded right now.</p>
            <button
              onClick={() => {
                setLoading(true);
                void load();
              }}
              className="ink-link mt-3 text-[14px] font-semibold"
            >
              Try again
            </button>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <Reveal className={GRID}>
          <div className="col-span-4 border-t border-line-2 pt-6 md:col-span-9 md:col-start-4">
            <p className="display text-[1.75rem]">No reviews yet.</p>
            <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-fg-2">
              If we have worked together, yours would be the first.
            </p>
          </div>
        </Reveal>
      ) : (
        <ul className={`${GRID} gap-y-14`}>
          <AnimatePresence initial={false}>
            {reviews.map((review, i) => (
              <ReviewItem key={review.id} review={review} index={i} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          aria-hidden
          width={size}
          height={size}
          viewBox="0 0 12 12"
          className={star <= rating ? "text-red-hi" : "text-fg-4"}
        >
          <path
            fill="currentColor"
            d="M6 .8l1.53 3.27 3.57.43-2.63 2.45.69 3.53L6 8.74 2.84 10.48l.69-3.53L.9 4.5l3.57-.43z"
          />
        </svg>
      ))}
    </span>
  );
}

/** One review per bay: rating, quote, attribution. */
function ReviewItem({ review, index }: { review: Review; index: number }) {
  const reduced = useReducedMotion();
  const name = review.anonymous ? "Anonymous" : review.name || "Colleague";
  const detail = review.anonymous ? "" : [review.role, review.company].filter(Boolean).join(", ");

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : Math.min(index, 5) * 0.05, ease: EASE }}
      className="col-span-4 flex flex-col border-t border-line-2 pt-6 md:col-span-6 lg:col-span-3"
    >
      <Stars rating={review.rating} />
      <blockquote className="serif text-pretty mt-6 flex-1 text-[1.2rem] leading-[1.5] break-words whitespace-pre-wrap text-fg">
        &ldquo;{review.message}&rdquo;
      </blockquote>
      <div className="mt-8 border-t border-line pt-4">
        <p className="text-[14px] font-semibold break-words">{name}</p>
        {detail ? <p className="mt-1 text-[13px] break-words text-fg-3">{detail}</p> : null}
      </div>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */

function ReviewForm({ onAdded }: { onAdded: (review: Review | null) => void }) {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setNotice(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.fields ?? {});
        setNotice(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("done");

      if (data.pending) {
        setNotice("Thank you — your review has been sent for approval.");
        setTimeout(() => onAdded(null), 2200);
      } else {
        setTimeout(() => onAdded(data.review as Review), 1100);
      }
    } catch {
      setNotice("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
        role="status"
        className="flex items-center gap-5 border-t border-line-2 pt-8"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center border border-line-2 text-red-hi">
          <IconCheck width={18} height={18} />
        </span>
        <p className="display text-[1.6rem]">{notice ?? "Thank you — your review is live."}</p>
      </motion.div>
    );
  }

  const ratingShown = hoverRating || form.rating;

  return (
    <form onSubmit={submit} noValidate className="relative border-t border-line-2 pt-8">
      <Honeypot value={form.website} onChange={(v) => set("website", v)} />

      {/* Rating and anonymity share the first row */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span id="review-rating-label" className="label mb-2.5 block !text-fg-2">
            Rating
          </span>
          <div
            role="group"
            aria-labelledby="review-rating-label"
            aria-describedby={errors.rating ? "review-rating-note" : undefined}
            className="flex items-center"
            onMouseLeave={() => setHoverRating(0)}
          >
            <div className="flex border border-line-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= ratingShown;
                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={form.rating === star}
                    onMouseEnter={() => setHoverRating(star)}
                    onFocus={() => setHoverRating(star)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => set("rating", star)}
                    className="grid h-12 w-12 place-items-center border-l border-line-2 bg-raised transition-colors duration-200 first:border-l-0 hover:bg-raised-2"
                  >
                    <svg
                      aria-hidden
                      width={16}
                      height={16}
                      viewBox="0 0 12 12"
                      className={active ? "text-red-hi" : "text-fg-4"}
                    >
                      <path
                        fill="currentColor"
                        d="M6 .8l1.53 3.27 3.57.43-2.63 2.45.69 3.53L6 8.74 2.84 10.48l.69-3.53L.9 4.5l3.57-.43z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
            <span className="tnum ml-4 text-[13px] text-fg-3" aria-live="polite">
              {ratingShown} of 5
            </span>
          </div>
          {errors.rating ? (
            <p id="review-rating-note" role="alert" className="mt-2 text-[13px] text-red-hi">
              {errors.rating}
            </p>
          ) : null}
        </div>

        <label className="group flex h-12 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => set("anonymous", e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center border border-line-3 text-transparent transition-colors duration-300 group-hover:border-fg peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-fg"
          >
            <IconCheck width={12} height={12} />
          </span>
          <span className="text-[14px] font-medium text-fg-2 transition-colors duration-300 group-hover:text-fg">
            Post anonymously
          </span>
        </label>
      </div>

      {/* Identity — three fields, one per bay; removed entirely when anonymous */}
      <AnimatePresence initial={false}>
        {!form.anonymous ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-x-5 gap-y-7 pt-7 sm:grid-cols-3 sm:gap-x-6">
              <Field label="Name" htmlFor="review-name" error={errors.name}>
                <input
                  id="review-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy("review-name", errors.name)}
                  className={inputClass(errors.name)}
                />
              </Field>
              <Field label="Role" htmlFor="review-role" optional>
                <input
                  id="review-role"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="Supervising Solicitor"
                  maxLength={100}
                  autoComplete="organization-title"
                  className={inputClass()}
                />
              </Field>
              <Field label="Company" htmlFor="review-company" optional>
                <input
                  id="review-company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Where you worked together"
                  maxLength={100}
                  autoComplete="organization"
                  className={inputClass()}
                />
              </Field>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-7">
        <Field
          label="Your experience working with Doyin"
          htmlFor="review-message"
          error={errors.message}
          hint={`${form.message.length} / 1500`}
        >
          <textarea
            id="review-message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            maxLength={1500}
            placeholder="What was it like to work together? How did she handle the matter, and what stood out?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("review-message", errors.message, `${form.message.length} / 1500`)}
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
          {status === "sending" ? "Publishing…" : "Publish review"}
          {status === "sending" ? null : (
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </Button>
        <p className="text-[13.5px] text-fg-3">
          Your review appears on this page once published. Nothing else about you is stored.
        </p>
      </div>
    </form>
  );
}
