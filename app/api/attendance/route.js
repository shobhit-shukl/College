import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = jwt.verify(token, process.env.JWT_SECRET);

    const res = await pool.query(
      "SELECT * FROM attendance WHERE student_id=$1",
      [user.studentId]
    );

    return Response.json({ attendance: res.rows[0] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}


