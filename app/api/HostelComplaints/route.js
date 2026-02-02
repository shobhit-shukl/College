import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET handler
export async function GET(req) {
  try {
    const query = `
      SELECT *
      FROM "Hostel_complaints"
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err);
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}


// POST handler
export async function POST(req) {
  try {
    const { student_id, name, complaint_title, complaint_desc } = await req.json();

    if (!student_id || !name || !complaint_title || !complaint_desc) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO "Hostel_complaints"
        (student_id, name, complaint_title, complaint_desc)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      student_id,
      name,
      complaint_title,
      complaint_desc,
    ]);

    return NextResponse.json(rows[0], { status: 201 });

  } catch (error) {
    console.error("❌ Complaint API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
