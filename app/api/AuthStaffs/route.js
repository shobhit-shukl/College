import { pool } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Never send the password column to the browser
const publicStaff = ({ Password, ...row }) => row;

export async function POST(req) {
  try {
    const { id } = await req.json();

    const result = await pool.query(
      `SELECT * FROM "Staff" WHERE "Staff_id" = $1`,
      [id]
    );

    return Response.json(result.rows.map(publicStaff));
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Staff update their own contact details; admins may update anyone's
export async function PUT(req) {
  try {
    const user = requireAuth(req);
    const { id, Staff_email, Phone } = await req.json();

    const isAdmin = ["superadmin", "admin", "hr"].includes(String(user.role).toLowerCase());
    if (!id || (!isAdmin && String(user.id) !== String(id))) {
      return Response.json({ error: "You can only edit your own profile" }, { status: 403 });
    }

    const result = await pool.query(
      `UPDATE "Staff" SET "Staff_email" = $1, "Phone" = $2 WHERE "Staff_id" = $3 RETURNING *`,
      [String(Staff_email || "").trim(), String(Phone || "").trim(), id]
    );
    if (!result.rowCount) return Response.json({ error: "Staff not found" }, { status: 404 });

    return Response.json(publicStaff(result.rows[0]));
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
