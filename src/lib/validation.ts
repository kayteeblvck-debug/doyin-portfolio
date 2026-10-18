/**
 * Hand-rolled validation. No schema library — the surface is small enough
 * that a dependency would cost more than it saves.
 *
 * Every field is length-capped so a single request cannot fill the database,
 * and control characters are stripped before anything is stored.
 */

import type { NewContactMessage, NewReview } from "./types";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

export const LIMITS = {
  name: 80,
  role: 100,
  company: 100,
  email: 254,
  reason: 120,
  reviewMessage: 1500,
  contactMessage: 4000,
} as const;

const MIN_REVIEW_LENGTH = 20;
const MIN_MESSAGE_LENGTH = 10;

/** Control characters, excluding tab (U+0009) and newline (U+000A). */
const CONTROL_CHARS = new RegExp(
  "[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]",
  "g",
);

/** Strips control characters and collapses runaway whitespace. */
function clean(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim()
    .slice(0, max);
}

/**
 * Deliberately permissive — the goal is to catch typos, not to police
 * valid-but-unusual addresses. Real verification is the reply landing.
 */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= LIMITS.email;
}

/** Cheap heuristic for the obvious link-spam case. */
function looksLikeSpam(text: string): boolean {
  const links = (text.match(/https?:\/\//gi) ?? []).length;
  return links >= 3;
}

export function validateReview(body: unknown): ValidationResult<NewReview> {
  const errors: Record<string, string> = {};
  const input = (body ?? {}) as Record<string, unknown>;

  const anonymous = input.anonymous === true || input.anonymous === "true";
  const message = clean(input.message, LIMITS.reviewMessage);
  const name = clean(input.name, LIMITS.name);
  const role = clean(input.role, LIMITS.role);
  const company = clean(input.company, LIMITS.company);

  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Pick a rating from 1 to 5.";
  }

  if (message.length < MIN_REVIEW_LENGTH) {
    errors.message = `Please write at least ${MIN_REVIEW_LENGTH} characters.`;
  } else if (looksLikeSpam(message)) {
    errors.message = "Too many links — please write a plain message.";
  }

  if (!anonymous && name.length < 2) {
    errors.name = "Add your name, or tick “Post anonymously”.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { name, role, company, rating, message, anonymous },
  };
}

export function validateContact(body: unknown): ValidationResult<NewContactMessage> {
  const errors: Record<string, string> = {};
  const input = (body ?? {}) as Record<string, unknown>;

  const name = clean(input.name, LIMITS.name);
  const email = clean(input.email, LIMITS.email).toLowerCase();
  const reason = clean(input.reason, LIMITS.reason);
  const message = clean(input.message, LIMITS.contactMessage);

  if (name.length < 2) errors.name = "Please tell me your name.";
  if (!isEmail(email)) errors.email = "That email address does not look right.";
  if (reason.length < 2) errors.reason = "Pick or describe a reason.";
  if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Please write at least ${MIN_MESSAGE_LENGTH} characters.`;
  } else if (looksLikeSpam(message)) {
    errors.message = "Too many links — please write a plain message.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, value: { name, email, reason, message } };
}

/**
 * Honeypot: a field hidden from humans by CSS. Bots fill every input they
 * find, so anything in here means the submission is automated.
 */
export function isBot(body: unknown): boolean {
  const input = (body ?? {}) as Record<string, unknown>;
  const trap = input.website;
  return typeof trap === "string" && trap.trim().length > 0;
}

/** Escapes user text before it is interpolated into notification HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
