// app/api/issue-book/route.js
import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

// GET handler to fetch all records
export async function GET() {
  try {
    const result = await pool.query(
      ' select  hs.*, s.* from "Hostel_Students" as hs  inner join students as s on hs."Student_id" = s.student_id;'
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching records:", err);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { Student_id, RoomNo, fee_status } = await req.json();

    if (!Student_id || !RoomNo || !fee_status) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO "Hostel_Students" ("Student_id", "RoomNo", fee_status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [Student_id, RoomNo, fee_status]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err) {
    console.error("DB ERROR 👉", err.message);

    // ✅ duplicate student
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Student already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

 