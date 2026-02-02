// app/api/AuthStudents/route.js
 import { pool } from "@/lib/db";

 


export async function POST(req) {
  try {
    const body = await req.json();
    const { student_course } = body;

    const result = await pool.query(
      `SELECT * FROM "notices" WHERE "course" = $1`,
      [student_course]
    );

    // 👉 saara data yahan hota hai
    const notices = result.rows;
    
    return new Response(
      JSON.stringify(notices),
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
