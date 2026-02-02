// app/api/AuthStudents/route.js
 import { pool } from "@/lib/db";

 


export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id } = body;

    const result = await pool.query(
      `select * from "students_result" where "Student_id" = $1`,
      [student_id]
    );
    // 👉 saara data yahan hota hai
    const exam_results = result.rows;
    return new Response(
      JSON.stringify(exam_results),
      { status: 200 }
    );
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
