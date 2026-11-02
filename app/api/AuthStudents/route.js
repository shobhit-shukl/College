import { pool } from "@/lib/db";
import { requireAuth, scopedStudentId } from "@/lib/auth";

// Never send the password column to the browser
function publicStudent({ Password, ...student }) {
  return { ...student, profileUrl: student.image || null };
}

export async function POST(req) {
  try {
    requireAuth(req);
    const body = await req.json();
    const id = scopedStudentId(req, body.id);

    const result = await pool.query(
      `SELECT * FROM "students" WHERE "student_id" = $1`,
      [id]
    );

    return Response.json(result.rows.map(publicStudent));
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// A student updating their own profile (currently just the display name)
export async function PUT(req) {
  try {
    const body = await req.json();
    const id = scopedStudentId(req, body.id);
    const name = String(body.name || "").trim();

    if (!id || !name) {
      return Response.json({ error: "id and name are required" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE "students" SET name = $1 WHERE "student_id" = $2 RETURNING *`,
      [name, id]
    );
    if (!result.rowCount) return Response.json({ error: "Student not found" }, { status: 404 });

    return Response.json(publicStudent(result.rows[0]));
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
