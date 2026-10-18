"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactMessage, Review } from "@/lib/types";
import { IconCheck, IconClose } from "@/components/ui/icons";
import { inputClass } from "@/components/ui/field";

const TOKEN_KEY = "doyin-admin-token";

/**
 * Review moderation.
 *
 * The token lives in sessionStorage (cleared when the tab closes) and is sent
 * as an x-admin-token header. Every check happens server-side — this page is
 * only a convenience wrapper around the API.
 */
export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (value: string) => {
    setError(null);
    try {
      const response = await fetch("/api/reviews", {
        headers: { "x-admin-token": value },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Request failed");

      const data = (await response.json()) as { reviews: Review[] };
      setReviews(data.reviews ?? []);

      // Contact messages are stored even when email is not set up — show them
      // here so nothing sent through the site goes unread.
      const inbox = await fetch("/api/contact", {
        headers: { "x-admin-token": value },
        cache: "no-store",
      });
      if (inbox.ok) {
        const mail = (await inbox.json()) as { messages: ContactMessage[] };
        setMessages(mail.messages ?? []);
      }
      setAuthed(true);
      sessionStorage.setItem(TOKEN_KEY, value);
    } catch {
      setError("Could not load reviews. Check the token and try again.");
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      void load(stored);
    }
  }, [load]);

  const act = async (id: string, action: "publish" | "unpublish" | "delete") => {
    setBusy(id);
    try {
      const response =
        action === "delete"
          ? await fetch(`/api/reviews/${id}`, {
              method: "DELETE",
              headers: { "x-admin-token": token },
            })
          : await fetch(`/api/reviews/${id}`, {
              method: "PATCH",
              headers: {
                "x-admin-token": token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ published: action === "publish" }),
            });

      if (!response.ok) throw new Error("Request failed");

      setReviews((current) =>
        action === "delete"
          ? current.filter((r) => r.id !== id)
          : current.map((r) =>
              r.id === id ? { ...r, published: action === "publish" } : r,
            ),
      );
    } catch {
      setError("That action failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  if (!authed) {
    return (
      <main className="relative z-10 grid min-h-screen place-items-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(token);
          }}
          className="w-full max-w-sm border-t-[3px] border-double border-line-2 pt-8"
        >
          <div className="label">Moderation</div>
          <h1 className="display mt-3 text-4xl">Review admin</h1>
          <p className="serif mt-3 text-[15px] text-fg-2 italic">
            Enter the ADMIN_TOKEN from your environment file.
          </p>

          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            autoComplete="off"
            className={`${inputClass()} mt-5`}
          />

          {error ? (
            <p role="alert" className="serif mt-3 text-sm text-red-hi italic">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-8 w-full border border-fg bg-fg px-6 py-3.5 text-[12px] font-medium tracking-[0.14em] text-bg uppercase transition-colors duration-300 hover:border-fg-2 hover:bg-fg-2"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  const pending = reviews.filter((r) => !r.published);
  const published = reviews.filter((r) => r.published);

  return (
    <main className="relative z-10 mx-auto min-h-screen w-full max-w-4xl px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-t-[3px] border-b border-double border-t-line-2 border-b-line pt-8 pb-6">
        <div>
          <div className="label">Moderation</div>
          <h1 className="display mt-3 text-4xl">Reviews</h1>
        </div>
        <div className="flex items-center gap-5 text-sm text-fg-3">
          <span>{published.length} published</span>
          <span>{pending.length} pending</span>
          <button
            onClick={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setAuthed(false);
              setToken("");
            }}
            className="ink-link text-[12px] font-medium tracking-[0.14em] text-fg uppercase"
          >
            Lock
          </button>
        </div>
      </header>

      {error ? (
        <p role="alert" className="serif mt-5 text-sm text-red-hi italic">
          {error}
        </p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="serif mt-12 text-center text-[15px] text-fg-3 italic">
          No reviews have been submitted yet.
        </p>
      ) : (
        <ul className="border-b border-line">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border-t border-line py-6 first:border-t-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="serif text-[17px]">
                      {review.anonymous ? "Anonymous" : review.name}
                    </span>
                    <span className="text-fg">
                      {"★".repeat(review.rating)}
                      <span className="text-line-2">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </span>
                    <span
                      className={`label border px-2 py-0.5 !text-[10px] ${
                        review.published
                          ? "border-fg !text-fg"
                          : "border-line-2"
                      }`}
                    >
                      {review.published ? "Live" : "Pending"}
                    </span>
                  </div>

                  {!review.anonymous && (review.role || review.company) ? (
                    <p className="label mt-1">
                      {[review.role, review.company].filter(Boolean).join(", ")}
                    </p>
                  ) : null}

                  <p className="serif mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-fg-2 italic">
                    {review.message}
                  </p>

                  <p className="mt-3 text-[11px] text-fg-3">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    disabled={busy === review.id}
                    onClick={() =>
                      act(review.id, review.published ? "unpublish" : "publish")
                    }
                    title={review.published ? "Hide from site" : "Publish"}
                    className="grid h-9 w-9 place-items-center border border-line-2 text-fg-3 transition-colors hover:border-fg hover:text-fg disabled:opacity-40"
                  >
                    {review.published ? (
                      <IconClose width={15} height={15} />
                    ) : (
                      <IconCheck width={15} height={15} />
                    )}
                  </button>

                  <button
                    disabled={busy === review.id}
                    onClick={() => {
                      if (
                        confirm(
                          "Delete this review permanently? This cannot be undone.",
                        )
                      ) {
                        void act(review.id, "delete");
                      }
                    }}
                    title="Delete permanently"
                    className="grid h-9 w-9 place-items-center border border-line-2 text-fg-3 transition-colors hover:border-fg hover:text-fg disabled:opacity-40"
                  >
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                    >
                      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <header className="mt-20 flex flex-wrap items-end justify-between gap-4 border-t-[3px] border-b border-double border-t-line-2 border-b-line pt-8 pb-6">
        <div>
          <div className="label">Inbox</div>
          <h2 className="display mt-3 text-4xl">Messages</h2>
        </div>
        <span className="text-sm text-fg-3">{messages.length} received</span>
      </header>

      {messages.length === 0 ? (
        <p className="serif mt-12 text-center text-[15px] text-fg-3 italic">
          No messages have been sent yet.
        </p>
      ) : (
        <ul className="border-b border-line">
          {messages.map((message) => (
            <li
              key={message.id}
              className="border-t border-line py-6 first:border-t-0"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="serif text-[17px]">
                  {message.name}
                </span>
                <a
                  href={`mailto:${message.email}`}
                  className="ink-link text-xs text-fg"
                >
                  {message.email}
                </a>
                <span className="label border border-line-2 px-2 py-0.5 !text-[10px]">
                  {message.reason}
                </span>
                {!message.emailed ? (
                  <span className="label border border-red-hi px-2 py-0.5 !text-[10px] !text-red-hi">
                    Not emailed
                  </span>
                ) : null}
              </div>
              <p className="serif mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-fg-2 italic">
                {message.message}
              </p>
              <p className="mt-3 text-[11px] text-fg-3">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
