// app/api/AuthStudents/route.js
 import { pool } from "@/lib/db";

 
export async function POST(req) {
  try {
    const body = await req.json();
    const { department } = body;
    console.log(department);

    const result = await pool.query(
      `SELECT * FROM "Tasks" WHERE "dept" = $1`,
      [department]
    );

    // 👉 saara data yahan hota hai
    const tasks = result.rows;
    
    return new Response(
      JSON.stringify(tasks),
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
