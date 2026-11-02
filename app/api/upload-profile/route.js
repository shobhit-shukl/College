import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Vercel's filesystem is read-only, so the photo is stored as a data URL in the image column
const MAX_IMAGE_CHARS = 3 * 1024 * 1024;

export async function POST(req) {
  try {
    const user = requireAuth(req);
    const { id, role: bodyRole, image } = await req.json();

    if (!id || !bodyRole || !image) {
      return NextResponse.json({ error: "id, role and image are required" }, { status: 400 });
    }

    const isStudentTarget = String(bodyRole).toLowerCase() === "student";

    // students may only change their own photo
    if (String(user.role).toLowerCase() === "student" && (!isStudentTarget || String(user.id) !== String(id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!/^data:image\/[^;]+;base64,/.test(image)) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }
    if (image.length > MAX_IMAGE_CHARS) {
      return NextResponse.json({ error: "Image too large (max ~2 MB)" }, { status: 413 });
    }

    const result = isStudentTarget
      ? await pool.query(`UPDATE students SET image = $1 WHERE student_id = $2`, [image, id])
      : await pool.query(`UPDATE "Staff" SET image = $1 WHERE "Staff_id" = $2`, [image, id]);

    if (!result.rowCount) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ url: image }, { status: 201 });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
