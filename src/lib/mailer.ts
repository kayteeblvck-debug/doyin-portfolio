/**
 * Email notifications.
 *
 * Three transports, picked in order of what is configured:
 *
 *   1. SMTP  — set SMTP_HOST/SMTP_USER/SMTP_PASS. Works with any provider,
 *              including a Gmail app password.
 *   2. Resend — set RESEND_API_KEY (and a verified MAIL_FROM domain).
 *   3. Console — nothing configured. Emails are logged to the terminal instead
 *              of thrown away, so local development works out of the box.
 *
 * Delivery never blocks the visitor: if email fails the submission is still
 * stored, and the API reports success. Nothing is lost — worst case a
 * notification is missing and the entry is still in the database and /admin
 * (reviews and contact messages both).
 */

import { escapeHtml } from "./validation";
import type { ContactMessage, Review } from "./types";

const NOTIFY_TO = process.env.NOTIFY_EMAIL || "omololaa226@gmail.com";
const MAIL_FROM =
  process.env.MAIL_FROM || process.env.SMTP_USER || "portfolio@localhost";
const SITE_NAME = "adedoyinomolola.com";

type Transport = "smtp" | "resend" | "console";

function activeTransport(): Transport {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return "smtp";
  }
  if (process.env.RESEND_API_KEY) return "resend";
  return "console";
}

export function mailerStatus(): { configured: boolean; transport: Transport } {
  const transport = activeTransport();
  return { configured: transport !== "console", transport };
}

type Mail = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

async function sendViaSmtp(mail: Mail): Promise<void> {
  const nodemailer = (await import("nodemailer")).default;

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"${SITE_NAME}" <${MAIL_FROM}>`,
    to: NOTIFY_TO,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: mail.replyTo,
  });
}

async function sendViaResend(mail: Mail): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [NOTIFY_TO],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

/** Returns true when the notification actually went out. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const transport = activeTransport();

  try {
    if (transport === "smtp") {
      await sendViaSmtp(mail);
      return true;
    }
    if (transport === "resend") {
      await sendViaResend(mail);
      return true;
    }

    console.info(
      [
        "",
        "──────────────────────────────────────────────",
        "  EMAIL NOT SENT — no transport configured",
        `  Would have gone to: ${NOTIFY_TO}`,
        `  Subject: ${mail.subject}`,
        "",
        mail.text,
        "──────────────────────────────────────────────",
        "  Set SMTP_* or RESEND_API_KEY in .env.local to",
        "  receive these by email. See README.md.",
        "",
      ].join("\n"),
    );
    return false;
  } catch (error) {
    console.error("[mailer] delivery failed:", error);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Templates                                                                 */
/* -------------------------------------------------------------------------- */

const shell = (title: string, rows: string, body: string) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0b;padding:32px;color:#f2f2f3">
  <div style="max-width:560px;margin:0 auto;background:#111113;border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden">
    <div style="padding:22px 26px;border-bottom:1px solid rgba(255,255,255,.1)">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e5273a">${title}</div>
    </div>
    <div style="padding:26px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
      <div style="margin-top:22px;padding:18px;background:rgba(255,255,255,.03);border-left:2px solid #e5273a;border-radius:6px;font-size:15px;line-height:1.65;white-space:pre-wrap">${body}</div>
    </div>
    <div style="padding:16px 26px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:#6a6a73">
      Sent automatically from your portfolio site.
    </div>
  </div>
</div>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 0;color:#9a9aa2;width:110px;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#f2f2f3">${value}</td>
  </tr>`;

export function contactTemplate(message: ContactMessage): Mail {
  const name = escapeHtml(message.name);
  const email = escapeHtml(message.email);
  const reason = escapeHtml(message.reason);
  const body = escapeHtml(message.message);

  return {
    subject: `Portfolio enquiry — ${message.reason} — ${message.name}`,
    replyTo: message.email,
    text: [
      `New contact form submission`,
      ``,
      `Name:   ${message.name}`,
      `Email:  ${message.email}`,
      `Reason: ${message.reason}`,
      ``,
      message.message,
      ``,
      `Reply directly to this email to respond.`,
    ].join("\n"),
    html: shell(
      "New enquiry",
      row("Name", name) +
        row("Email", `<a href="mailto:${email}" style="color:#e5273a">${email}</a>`) +
        row("Reason", reason),
      body,
    ),
  };
}

export function reviewTemplate(review: Review): Mail {
  const who = review.anonymous
    ? "Anonymous"
    : escapeHtml(
        [review.name, review.role, review.company]
          .filter(Boolean)
          .join(" · ") || "Unnamed",
      );
  const body = escapeHtml(review.message);
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  return {
    subject: `New review (${review.rating}/5) — ${review.anonymous ? "Anonymous" : review.name}`,
    text: [
      `New review left on your portfolio`,
      ``,
      `From:   ${review.anonymous ? "Anonymous" : [review.name, review.role, review.company].filter(Boolean).join(" · ")}`,
      `Rating: ${review.rating}/5`,
      `Status: ${review.published ? "Published — live on the site now" : "Pending your approval at /admin"}`,
      ``,
      review.message,
    ].join("\n"),
    html: shell(
      "New review",
      row("From", who) +
        row("Rating", `<span style="color:#e5273a;letter-spacing:2px">${stars}</span> ${review.rating}/5`) +
        row(
          "Status",
          review.published
            ? "Published — live on the site now"
            : "Pending approval — visit /admin to publish",
        ),
      body,
    ),
  };
}
