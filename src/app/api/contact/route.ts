import { NextResponse } from "next/server";
import { createMessage, listMessages, markMessageEmailed } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import type { ContactMessage } from "@/lib/types";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import { isBot, validateContact } from "@/lib/validation";
import { contactTemplate, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/contact — every stored enquiry, newest first. Admin only, so
 * messages are never lost even when email delivery is not configured.
 */
export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  try {
    return NextResponse.json({ messages: await listMessages() });
  } catch (error) {
    console.error("[api/contact] GET failed:", error);
    return NextResponse.json({ error: "Could not load messages." }, { status: 500 });
  }
}

/** POST /api/contact — sends an enquiry to the configured inbox. */
export async function POST(request: Request) {
  try {
    const ipHash = hashIp(request);

    const limit = rateLimit(`contact:${ipHash}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Too many messages sent. Try again in ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minutes, or email me directly.`,
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const body = await request.json().catch(() => null);
    if (body === null) {
      return NextResponse.json({ error: "Malformed request." }, { status: 400 });
    }

    if (isBot(body)) {
      return NextResponse.json({ ok: true });
    }

    const result = validateContact(body);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: result.errors },
        { status: 422 },
      );
    }

    // Store first, then notify — so a mail outage never loses a message.
    // The row is the source of truth; `emailed` records whether the
    // notification actually got out.
    //
    // If storage itself is unavailable (misconfigured database on a fresh
    // deploy, for instance) the email is still the thing that matters, so send
    // it anyway rather than turning a visitor away.
    let stored: ContactMessage;
    let persisted = true;

    try {
      stored = await createMessage(result.value, ipHash, false);
    } catch (error) {
      console.error("[api/contact] could not store message:", error);
      persisted = false;
      stored = {
        id: "unsaved",
        ...result.value,
        createdAt: new Date().toISOString(),
        emailed: false,
      };
    }

    const delivered = await sendMail(contactTemplate(stored));
    if (delivered && persisted) await markMessageEmailed(stored.id);

    // The visitor only sees a failure if the message reached nobody at all.
    if (!delivered && !persisted) {
      return NextResponse.json(
        {
          error:
            "Your message could not be sent right now. Please email me directly instead.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, delivered }, { status: 201 });
  } catch (error) {
    console.error("[api/contact] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 },
    );
  }
}
