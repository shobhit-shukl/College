import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Vercel's filesystem is read-only, so uploaded files are stored inline as data URLs
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

// Inline (data URL) files are served by /api/timetable/file instead of
// shipping every file in the list response
const LIST_COLUMNS = `id, timetable_type, department, uploaded_at,
  CASE WHEN file_url LIKE 'data:%' THEN '/api/timetable/file?id=' || id ELSE file_url END AS file_url,
  (file_url LIKE 'data:image/%' OR file_url ~* '[.](jpe?g|png|gif|webp)$') AS is_image`;

function isStudent(req) {
  try {
    return String(requireAuth(req).role).toLowerCase() === "student";
  } catch {
    return true;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department");
    const timetable_type = searchParams.get("timetable_type");

    let result;
    if (department && timetable_type) {
      result = await pool.query(
        `SELECT ${LIST_COLUMNS}
         FROM timetable
         WHERE department = $1 AND timetable_type = $2
         ORDER BY uploaded_at DESC`,
        [department, timetable_type]
      );
    } else {
      result = await pool.query(
        `SELECT ${LIST_COLUMNS}
         FROM timetable
         ORDER BY uploaded_at DESC`
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Fetch timetable error:", error);
    return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 });
  }
}

export async function POST(req) {
  if (isStudent(req)) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  try {
    let file_url = null;
    let timetable_type = null;
    let department = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      file_url = body.file_url;
      timetable_type = body.timetable_type;
      department = body.department;
    } else {
      const formData = await req.formData();
      timetable_type = formData.get("timetable_type");
      department = formData.get("department");
      const file = formData.get("file");

      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        if (file.size > MAX_UPLOAD_BYTES) {
          return NextResponse.json({ error: "File too large (max 3 MB)" }, { status: 413 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        file_url = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;
      }
    }

    if (!file_url || !timetable_type || !department) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO timetable (file_url, timetable_type, department)
       VALUES ($1, $2, $3)
       RETURNING ${LIST_COLUMNS}`,
      [file_url, timetable_type, department]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Upload timetable error:", error);
    return NextResponse.json({ error: "Failed to upload timetable" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (isStudent(req)) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const del = await pool.query(`DELETE FROM timetable WHERE id = $1`, [id]);
    if (del.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete timetable error:", error);
    return NextResponse.json({ error: "Failed to delete timetable" }, { status: 500 });
  }
}
