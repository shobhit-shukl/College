import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

import { generateExcel } from "@/lib/excel";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const isExport = searchParams.get('export') === 'true';

    let query = `SELECT 
        "Staff_id" AS id,
        "Staff_name" AS name,
        "Staff_dept" AS department,
        "Staff_email" AS email,
        "Phone" AS phone
        FROM "Staff"`;

    const conditions = [];
    const values = [];

    // Filter Mappings
    const filters = [
      { param: 'id', col: '"Staff_id"' },
      { param: 'name', col: '"Staff_name"' },
      { param: 'department', col: '"Staff_dept"' },
      { param: 'email', col: '"Staff_email"' }
    ];

    filters.forEach(({ param, col }) => {
      const val = searchParams.get(param);
      if (val) {
        conditions.push(`${col} ILIKE $${values.length + 1}`);
        values.push(`%${val}%`);
      }
    });

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await pool.query(query, values);

    if (isExport) {
      const fileBuffer = generateExcel(result.rows);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=Staff_Report.xlsx'
        }
      });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}



export async function POST(req) {
  try {
    const { id, name, department, email } = await req.json();

    await pool.query(
      `INSERT INTO "Staff" ("Staff_id", "Staff_name", "Staff_dept", "Staff_email")
       VALUES ($1, $2, $3, $4);`,
      [id, name, department, email]
    );

    return NextResponse.json(
      { message: "Staff added successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("ADD STAFF ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function DELETE(req) {
  const { id } = await req.json();   // deleting by numeric id

  await pool.query(
    `DELETE FROM "Staff" WHERE UPPER("Staff_id") = UPPER($1)`,
    [id]
  );

  return Response.json({ message: "Deleted" });
}
