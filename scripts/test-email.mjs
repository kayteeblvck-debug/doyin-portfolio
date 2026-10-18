/**
 * Verifies that email notifications actually reach your inbox.
 *
 *   npm run email:test
 *
 * It uses the exact same environment variables the website uses, so if this
 * succeeds, reviews and contact messages will be delivered too.
 */

import nodemailer from "nodemailer";

const NOTIFY_TO = process.env.NOTIFY_EMAIL || "omololaa226@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || "";

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

console.log(bold("\nEmail delivery test\n"));

const hasSmtp =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
const hasResend = Boolean(process.env.RESEND_API_KEY);

if (!hasSmtp && !hasResend) {
  console.log(red("✗ No mail transport configured."));
  console.log(`
Nothing will be emailed yet — notifications are printed to the terminal instead.
Reviews and messages are still saved, so nothing is lost.

To receive email at ${bold(NOTIFY_TO)}, open ${bold(".env.local")} and uncomment
the SMTP block, then fill in a Gmail ${bold("app password")}:

  Google Account -> Security -> 2-Step Verification (must be on) -> App passwords
  (your normal Gmail password will NOT work)

  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_USER=${NOTIFY_TO}
  SMTP_PASS=your-16-character-app-password
  MAIL_FROM=${NOTIFY_TO}

Then run this again.
`);
  process.exit(1);
}

if (hasResend && !hasSmtp) {
  console.log(dim("Transport: Resend"));
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [NOTIFY_TO],
      subject: "Portfolio email test",
      text: "If you are reading this, your portfolio can email you. Reviews and contact messages will arrive here.",
    }),
  });

  if (response.ok) {
    console.log(green(`\n✓ Sent to ${NOTIFY_TO}. Check your inbox.\n`));
    process.exit(0);
  }
  console.log(red(`\n✗ Resend rejected it (${response.status}):`));
  console.log(await response.text());
  process.exit(1);
}

console.log(dim(`Transport: SMTP  (${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 465})`));
console.log(dim(`From:      ${MAIL_FROM}`));
console.log(dim(`To:        ${NOTIFY_TO}\n`));

const port = Number(process.env.SMTP_PORT || 465);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

try {
  process.stdout.write("Checking credentials... ");
  await transporter.verify();
  console.log(green("ok"));

  process.stdout.write("Sending test email...   ");
  const info = await transporter.sendMail({
    from: `"adedoyinomolola.com" <${MAIL_FROM}>`,
    to: NOTIFY_TO,
    subject: "Portfolio email test",
    text: [
      "If you are reading this, your portfolio can email you.",
      "",
      "Every new review and every contact form message will arrive at this address.",
    ].join("\n"),
  });
  console.log(green("ok"));
  console.log(dim(`\nMessage id: ${info.messageId}`));
  console.log(green(`\n✓ Delivered to ${NOTIFY_TO}. Check your inbox (and spam on the first one).\n`));
} catch (error) {
  console.log(red("failed\n"));
  console.log(red(`✗ ${error.message}\n`));

  const message = String(error.message).toLowerCase();
  if (message.includes("invalid login") || message.includes("auth")) {
    console.log(`This is almost always the password. Gmail requires an ${bold("app password")} —
your normal account password is rejected. Generate one at:
Google Account -> Security -> 2-Step Verification -> App passwords
`);
  } else if (message.includes("timeout") || message.includes("econn")) {
    console.log(`Could not reach ${process.env.SMTP_HOST}:${port}.
Check the host and port, and whether your network blocks outbound SMTP.
Try port 587 instead of 465 if 465 is blocked.
`);
  }
  process.exit(1);
}
