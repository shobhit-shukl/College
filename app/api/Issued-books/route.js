 import { pool } from "@/lib/db";

 


export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id } = body;

    const result = await pool.query(
      `select * from "Issue-Books" where student_id = $1`,
      [student_id]
    );
    // 👉 saara data yahan hota hai
    const Issued_books = result.rows;
     
    return new Response(
      JSON.stringify(Issued_books),
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
