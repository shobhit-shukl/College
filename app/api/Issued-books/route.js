import { pool } from "@/lib/db";
import { scopedStudentId } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const student_id = scopedStudentId(req, body.student_id);

    const result = await pool.query(
      `SELECT ib.*, COALESCE(ib.book_name, b."Book-Name") AS book_name
       FROM "Issue-Books" ib
       LEFT JOIN "Books" b ON b."Book-Id" = ib.book_id
       WHERE ib.student_id = $1
       ORDER BY ib.issue_date DESC, ib.id DESC`,
      [student_id]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
