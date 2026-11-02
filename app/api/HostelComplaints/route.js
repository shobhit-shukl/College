import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAuth, scopedStudentId } from "@/lib/auth";

// GET handler
export async function GET(req) {
  try {
    // Students only ever see their own complaints; staff may filter by ?student_id
    const student_id = scopedStudentId(req, new URL(req.url).searchParams.get("student_id"));

    const result = student_id
      ? await pool.query(
          `SELECT * FROM "Hostel_complaints" WHERE student_id = $1 ORDER BY created_at DESC`,
          [student_id]
        )
      : await pool.query(`SELECT * FROM "Hostel_complaints" ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err);
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}


// POST handler
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, complaint_title, complaint_desc } = body;
    const student_id = scopedStudentId(req, body.student_id);

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

// PATCH handler - staff update a complaint's status
export async function PATCH(req) {
  try {
    if (String(requireAuth(req).role).toLowerCase() === "student") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const { id, status } = await req.json();
    if (!id || !["Pending", "Resolved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "id and a valid status are required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `UPDATE "Hostel_complaints" SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (!rows.length) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("❌ Complaint update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
