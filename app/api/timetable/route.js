import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department");
    const timetable_type = searchParams.get("timetable_type");

    let result;
    if (department && timetable_type) {
      result = await pool.query(
        `SELECT id, file_url, timetable_type, department, uploaded_at
         FROM timetable
         WHERE department = $1 AND timetable_type = $2
         ORDER BY uploaded_at DESC`,
        [department, timetable_type]
      );
    } else {
      result = await pool.query(
        `SELECT id, file_url, timetable_type, department, uploaded_at
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

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "timetables");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const safeName = String(file.name).replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const filename = `${timetable_type || 'unknown'}-${Date.now()}-${safeName}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        file_url = `/uploads/timetables/${filename}`;
      }
    }

    if (!file_url || !timetable_type || !department) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    try {
      const result = await pool.query(
        `INSERT INTO timetable (file_url, timetable_type, department)
         VALUES ($1, $2, $3)
         RETURNING id, file_url, timetable_type, department, uploaded_at`,
        [file_url, timetable_type, department]
      );

      return NextResponse.json(result.rows[0]);
    } catch (dbErr) {
      console.error("DB insert failed, returning file_url anyway:", dbErr);
      return NextResponse.json({ success: true, file_url, note: "DB insert failed" });
    }
  } catch (error) {
    console.error("Upload timetable error:", error);
    return NextResponse.json({ error: "Failed to upload timetable" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const sel = await pool.query(`SELECT file_url FROM timetable WHERE id = $1`, [id]);
    if (sel.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const file_url = sel.rows[0].file_url;

    await pool.query(`DELETE FROM timetable WHERE id = $1`, [id]);

    try {
      const filePath = path.join(process.cwd(), "public", file_url.replace(/^\//, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.error("Failed to delete file from disk", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete timetable error:", error);
    return NextResponse.json({ error: "Failed to delete timetable" }, { status: 500 });
  }
}
