import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";

/* =========================
   GET → Fetch Timetables
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department");
    const timetable_type = searchParams.get("timetable_type");

    if (!department || !timetable_type) {
      return NextResponse.json(
        { error: "department & timetable_type required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, file_url, timetable_type, department, uploaded_at
       FROM timetable
       WHERE department = $1 AND timetable_type = $2
       ORDER BY uploaded_at DESC`,
      [department, timetable_type]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Fetch timetable error:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetables" },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Upload Timetable
========================= */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const department = formData.get("department");
    const timetable_type = formData.get("timetable_type");
    const file = formData.get("file");

    if (!file || !department || !timetable_type) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/timetables"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${timetable_type}-${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const file_url = `/uploads/timetables/${filename}`;

    await pool.query(
      `INSERT INTO timetable (file_url, timetable_type, department)
       VALUES ($1, $2, $3)`,
      [file_url, timetable_type, department]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload timetable error:", error);
    return NextResponse.json(
      { error: "Failed to upload timetable" },
      { status: 500 }
    );
  }
}
