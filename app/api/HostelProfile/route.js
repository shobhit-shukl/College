import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { scopedStudentId } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const student_id = scopedStudentId(req, body.student_id);

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
        hs.hostel_name,
        hr.room_type,
        hs.created_at
      FROM "Hostel_Students" hs
      LEFT JOIN "Hostel_Rooms" hr ON hr.room_no = hs."RoomNo"
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
