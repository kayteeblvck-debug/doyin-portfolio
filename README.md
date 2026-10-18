# Adedoyin Omolola — Portfolio

Personal portfolio site. Next.js 16, TypeScript, Tailwind CSS 4, Motion.

Dark, black-and-white design with red used sparingly, set on a strict 12-column
grid (faint column guides are visible behind the page). Newsreader for headings,
Manrope for text. A public review wall, a contact form that emails you, and a
résumé download.

---

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Reviews save to a local SQLite file and emails print to your terminal until you
configure a mail transport (below).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run email:test` | Send a real test email with your `.env.local` settings |
| `npm run db:test` | Check the Postgres connection in `DATABASE_URL` |

Requires **Node 22.5 or newer** — the local review database uses Node's built-in
`node:sqlite`.

---

## Editing the site

**Almost everything you will want to change lives in one file:
[`src/lib/content.ts`](src/lib/content.ts).**

| What you want to change | Where |
| --- | --- |
| Name, motto, hero chips, intro, location | `site` |
| Email and LinkedIn | `contact` |
| About story, pull quote and the four fact tiles | `about` |
| The four "Where I add value" cards | `capabilities` |
| Experience roles (expandable list + filter chips) | `roles` |
| "Experience in numbers" | `metrics` |
| Education timeline | `education` |
| "How I think about corporate law" | `philosophy` |
| Section headings and intros | `sections` |

Section order lives in [`src/app/page.tsx`](src/app/page.tsx).

### Updating the résumé

Replace `public/Adedoyin-Omolola-CV.pdf` with the new file (keep the name), or
point `site.cv` at a different file. Set `site.cv = ""` to hide every download
button.

### Updating the photo

The hero uses `public/adedoyin-omolola-portrait.png`, a cut-out of her portrait
on a transparent background (it sits in a framed panel). Replace it with
another transparent PNG of the same shape. `public/adedoyin-omolola.png` is the
original photo, used for social share cards.

---

## Configuration

```bash
cp .env.example .env.local
```

`.env.local` is gitignored. **Never commit it.**

### Email notifications

Every review and contact message triggers an email to `omololaa226@gmail.com`
(change with `NOTIFY_EMAIL`). Until a transport is configured, notifications are
printed to the terminal instead — everything is still saved to the database.

**Gmail SMTP** — needs an app password (turn on 2-Step Verification, then
Google Account → Security → App passwords):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=omololaa226@gmail.com
SMTP_PASS=your-16-character-app-password
MAIL_FROM=omololaa226@gmail.com
```

**Resend** — `RESEND_API_KEY` plus a `MAIL_FROM` on a verified domain (or
`onboarding@resend.dev` for testing).

Run `npm run email:test` to confirm delivery.

### Review moderation

Reviews publish immediately by default. Set `REVIEWS_REQUIRE_APPROVAL=true` to
hold them for approval. Visit **`/admin`** and paste your `ADMIN_TOKEN` to
publish, hide or delete reviews.

### Database

Locally, reviews and messages go to `data/portfolio.db` (SQLite, no setup).
Set `DATABASE_URL` to a Postgres connection string and the app switches over,
creating its tables on first run.

---

## Deploying to Netlify

Netlify is serverless, so **`DATABASE_URL` is mandatory** — a SQLite file would
lose every review between requests.

1. Create a free Postgres database at [neon.com](https://neon.com) and copy the
   connection string.
2. In Netlify: **Add new site → Import an existing project → GitHub →
   `doyin-portfolio`**. `netlify.toml` supplies the build settings.
3. Before the first deploy, add under **Site configuration → Environment
   variables**: `DATABASE_URL`, `NOTIFY_EMAIL`, `ADMIN_TOKEN`, `IP_HASH_SALT`,
   and either the `SMTP_*` values or `RESEND_API_KEY` + `MAIL_FROM`.
4. Deploy.

Once a domain is bought, set `site.url` in `src/lib/content.ts` — it feeds the
canonical URL, sitemap, `robots.txt` and social share cards.

---

## How it is built

```
src/
├── app/
│   ├── layout.tsx           Fonts, metadata, JSON-LD, theme bootstrap
│   ├── page.tsx             Section order
│   ├── globals.css          Design tokens for both themes
│   ├── admin/page.tsx       Review moderation
│   └── api/
│       ├── reviews/         GET list · POST create · PATCH/DELETE (admin)
│       └── contact/         POST — stores, then emails
├── components/
│   ├── sections/            One file per section of the page
│   └── ui/                  Shared primitives (Reveal, Magnetic, TiltCard…)
└── lib/
    ├── content.ts           All copy and data
    ├── db.ts                SQLite + Postgres drivers behind one interface
    ├── mailer.ts            SMTP / Resend / console transports
    ├── validation.ts        Input validation, sanitising, honeypot
    ├── rate-limit.ts        Sliding window, IP hashed with a salt
    └── admin.ts             Constant-time token check
```

Animations respect `prefers-reduced-motion`. Forms have a honeypot, rate limits
(3 reviews / 5 messages per hour per IP), length caps and link-spam rejection.
Anonymous reviews store no name, role or company at all.
