import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const timetable_type = searchParams.get("timetable_type");

    if (!department || !timetable_type) {
      return NextResponse.json(
        { error: "Missing department or timetable_type" },
        { status: 400 }
      );
    }

    const query = `
      SELECT id, file_url, timetable_type, department, uploaded_at
      FROM public.timetable
      WHERE department = $1 AND timetable_type = $2
      ORDER BY uploaded_at DESC
    `;

    const result = await pool.query(query, [department, timetable_type]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching timetables:", err);
    return NextResponse.json(
      { error: "Failed to fetch timetables" },
      { status: 500 }
    );
  }
}
