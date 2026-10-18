import { NextResponse } from "next/server";
import { deleteReview, setReviewPublished } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

const unauthorized = () =>
  NextResponse.json({ error: "Not authorised." }, { status: 401 });

/** PATCH /api/reviews/:id — publish or unpublish. Admin only. */
export async function PATCH(request: Request, { params }: Context) {
  if (!isAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as {
      published?: boolean;
    };

    if (typeof body.published !== "boolean") {
      return NextResponse.json(
        { error: "Expected { published: boolean }." },
        { status: 400 },
      );
    }

    await setReviewPublished(id, body.published);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/reviews/:id] PATCH failed:", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

/** DELETE /api/reviews/:id — remove permanently. Admin only. */
export async function DELETE(request: Request, { params }: Context) {
  if (!isAdmin(request)) return unauthorized();

  try {
    const { id } = await params;
    await deleteReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/reviews/:id] DELETE failed:", error);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
