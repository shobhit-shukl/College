import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// --- GET: Fetch all leaves with Staff Names ---
import { generateExcel } from "@/lib/excel";

// --- GET: Fetch all leaves with Staff Names ---
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const isExport = searchParams.get('export') === 'true';

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const baseQuery = `
      SELECT 
        l."id",    
        l."employee",
        s."Staff_name" AS "name",
        l."status",
        l."leave_type",
        l."start_date",
        l."end_date",
        l."reason"
      FROM "leave" l
      LEFT JOIN "Staff" s ON l.employee = s."Staff_id"
    `;

    const countQuery = `SELECT COUNT(*) FROM "leave"`;

    if (isExport) {
      const result = await pool.query(`${baseQuery} ORDER BY l.id DESC`);
      const fileBuffer = generateExcel(result.rows);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=Leaves_Report.xlsx'
        }
      });
    }

    // Fetch paginated
    const [dataResult, countResult] = await Promise.all([
      pool.query(`${baseQuery} ORDER BY l.id DESC LIMIT $1 OFFSET $2`, [limit, offset]),
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
    console.error("❌ Error fetching leaves:", err);
    return NextResponse.json({ error: "Failed to fetch leaves" }, { status: 500 });
  }
}

// --- POST: Create a new leave request ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { leave_type, start_date, end_date, status, employee, reason } = body;

    const query = `
      INSERT INTO "leave" (leave_type, start_date, end_date, status, employee, reason)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [leave_type, start_date, end_date, status || 'Pending', employee, reason];
    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting leave request:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

// --- PATCH: Update status (Approve/Reject) ---
export async function PATCH(request) {
  try {
    const { id, status } = await request.json();

    const query = `
      UPDATE "leave"
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Leave record not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating leave status:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}