import { pool } from "@/lib/db";

export async function GET() {
  try {
    // The Triple Join Query
    const query = `
      SELECT 
        s.student_id,
        s.name, 
        s.course, 
        s.department, 
        s.year, 
        s.semester, 
        ib.book_id, 
        ib.issue_date,
        b."Book-Name", 
        b."Publisher", 
        b."Book-category"
      FROM "Issue-Books" ib
      JOIN "students" s ON ib.student_id = s.student_id
      JOIN "Books" b ON ib.book_id = b."Book-Id"
      ORDER BY ib.id ASC;
    `;

    const result = await pool.query(query);

    return new Response(JSON.stringify(result.rows), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("DB Error:", error); 
    return new Response(JSON.stringify({ 
      error: "Failed to fetch issued records", 
      details: error.message 
    }), { status: 500 });
  }
}