// app/api/AuthStudents/route.js
 import { pool } from "@/lib/db";
 import { requireAuth } from "@/lib/auth";
 import fs from "fs";
 import path from "path";

// export async function POST(req) {
//   try {
//     const body = await req.json();   // body read karo
//     const { id } = body;

//     console.log(id);

//     await pool.query(
//         `SELECT * FROM "students" WHERE "student_id" = $1`,
//         [id]     
//       );

//     return new Response(
//       JSON.stringify({ id }),
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("DB Error:", error);
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    const user = requireAuth(req);
    const body = await req.json();
    const { id } = body;

    // students can only fetch their own record
    if (user.role === "student" && String(user.id) !== String(id)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const result = await pool.query(
      `SELECT * FROM "students" WHERE "student_id" = $1`,
      [id]
    );

    const students = result.rows;

    // attach profileUrl if an uploads file exists for this student
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(uploadsDir) && students.length) {
        const files = await fs.promises.readdir(uploadsDir);
        const prefix = `student-${id}`;
        const match = files.find((f) => f.startsWith(prefix));
        if (match) students[0].profileUrl = `/uploads/${match}`;
      }
    } catch (e) {
      console.warn("profile lookup failed", e);
    }

    return new Response(JSON.stringify(students), { status: 200 });

  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
