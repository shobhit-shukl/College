// pages/api/employees.js
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

import { generateExcel } from "@/lib/excel";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const isExport = searchParams.get('export') === 'true';

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const baseQuery = 'SELECT "Staff_id", "Staff_name", "Staff_email", "Phone", "Staff_type" FROM "Staff"';
    const countQuery = 'SELECT COUNT(*) FROM "Staff"';

    if (isExport) {
      const result = await pool.query(`${baseQuery} ORDER BY "Staff_id" ASC`);
      const fileBuffer = generateExcel(result.rows);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=Employees_List.xlsx'
        }
      });
    }

    // Fetch paginated
    const [dataResult, countResult] = await Promise.all([
      pool.query(`${baseQuery} ORDER BY "Staff_id" ASC LIMIT $1 OFFSET $2`, [limit, offset]),
      pool.query(countQuery)
    ]);

    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: dataResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  await pool.query(
    `DELETE FROM "Staff" WHERE UPPER("Staff_id") = UPPER($1)`,
    [id]
  );

  return Response.json({ message: "Deleted" });
}
