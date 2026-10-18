import { NextResponse } from "next/server";
import { createReview, listReviews, requireApproval } from "@/lib/db";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import { isBot, validateReview } from "@/lib/validation";
import { reviewTemplate, sendMail } from "@/lib/mailer";
import { isAdmin } from "@/lib/admin";

// node:sqlite and nodemailer both need the Node runtime, not Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/reviews — published reviews. Admins additionally see pending ones. */
export async function GET(request: Request) {
  try {
    const includeUnpublished = isAdmin(request);
    const reviews = await listReviews(includeUnpublished);

    return NextResponse.json(
      { reviews, requiresApproval: requireApproval },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/reviews] GET failed:", error);
    return NextResponse.json(
      { error: "Could not load reviews right now." },
      { status: 500 },
    );
  }
}

/** POST /api/reviews — leave a review. */
export async function POST(request: Request) {
  try {
    const ipHash = hashIp(request);

    // 3 reviews per hour from one address is generous for a real person
    // and tedious for anything automated.
    const limit = rateLimit(`review:${ipHash}`, 3, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `You have already left a few reviews. Try again in ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minutes.`,
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const body = await request.json().catch(() => null);
    if (body === null) {
      return NextResponse.json({ error: "Malformed request." }, { status: 400 });
    }

    // Honeypot hit — answer as if it worked so bots learn nothing.
    if (isBot(body)) {
      return NextResponse.json({ ok: true, review: null, pending: true });
    }

    const result = validateReview(body);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: result.errors },
        { status: 422 },
      );
    }

    const review = await createReview(result.value, ipHash);

    // Notification failure must not fail the visitor's submission — the review
    // is already stored and visible in /admin either way. Awaited, because a
    // serverless function (Netlify) may be frozen as soon as it responds.
    await sendMail(reviewTemplate(review)).catch((error) =>
      console.error("[api/reviews] notification failed:", error),
    );

    return NextResponse.json(
      {
        ok: true,
        review: review.published ? review : null,
        pending: !review.published,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/reviews] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your review. Please try again." },
      { status: 500 },
    );
  }
}
