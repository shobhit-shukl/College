import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_course } = body;

    // Notices posted without a course (or for "All") go to every student
    const result = await pool.query(
      `SELECT * FROM "notices"
       WHERE "course" = $1 OR "course" IS NULL OR "course" = '' OR "course" = 'All'
       ORDER BY date DESC NULLS LAST, created_at DESC`,
      [student_course]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
