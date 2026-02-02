import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
export async function POST(req) {
  try {
    const { student_id } = await req.json();

    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        hs.id,
        hs."Student_id",
        hs."RoomNo",
        hs.fee_status,
        hs.created_at
      FROM "Hostel_Students" hs
      WHERE hs."Student_id" = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [student_id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No hostel record found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });

  } catch (error) {
    console.error("Hostel API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
