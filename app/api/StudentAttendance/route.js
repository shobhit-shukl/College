import { pool } from "@/lib/db";
import { scopedStudentId } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const student_id = scopedStudentId(req, body.student_id);

    const result = await pool.query(
      `select * from "student_attendnce" where "Student_id" = $1`,
      [student_id]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
