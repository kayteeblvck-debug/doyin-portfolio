import { timingSafeEqual } from "node:crypto";

/**
 * Admin auth for the moderation endpoints.
 *
 * A single shared token in ADMIN_TOKEN, compared in constant time. This is
 * deliberately simple: there is exactly one admin, and a full auth system
 * would be more surface area than the feature is worth. If ADMIN_TOKEN is
 * unset, the admin endpoints are closed entirely rather than left open.
 */

export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 8) return false;

  const provided =
    request.headers.get("x-admin-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length >= 8);
}
