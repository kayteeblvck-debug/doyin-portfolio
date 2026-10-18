import { createHash } from "node:crypto";

/**
 * In-memory sliding-window rate limiter.
 *
 * Scope note: state lives in the process, so on a multi-instance or serverless
 * deployment each instance counts separately. That is an acceptable trade for a
 * personal site — it stops the casual flood without adding Redis. If this ever
 * needs to be exact, back `hits` with Redis and keep the same interface.
 */

const globalForLimit = globalThis as unknown as {
  __portfolioHits?: Map<string, number[]>;
};

const hits: Map<string, number[]> = (globalForLimit.__portfolioHits ??= new Map());

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const timestamps = (hits.get(key) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    hits.set(key, timestamps);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= cutoff)) hits.delete(k);
    }
  }

  return {
    allowed: true,
    remaining: limit - timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Hashes the client IP with a server-side salt. We never store a raw IP —
 * the hash is only used for rate limiting and duplicate detection.
 */
export function hashIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const salt = process.env.IP_HASH_SALT || "doyin-portfolio-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
