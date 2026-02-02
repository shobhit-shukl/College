import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ===================== GET ===================== */
import { generateExcel } from "@/lib/excel";

/* ===================== GET ===================== */
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const isExport = searchParams.get('export') === 'true';

        // Pagination Params
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Base Query
        const baseQuery = `SELECT * FROM "Staff"`;
        const countQuery = `SELECT COUNT(*) FROM "Staff"`;

        if (isExport) {
            const result = await pool.query(baseQuery);
            const fileBuffer = generateExcel(result.rows);
            return new Response(fileBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=Users_Report.xlsx'
                }
            });
        }

        // Fetch paginated data and total count
        const [dataResult, countResult] = await Promise.all([
            pool.query(`${baseQuery} ORDER BY id ASC LIMIT $1 OFFSET $2`, [limit, offset]),
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

/* ===================== PUT ===================== */
export async function PUT(req) {
    try {
        const { id, Staff_type } = await req.json();

        if (!id || !Staff_type) {
            return NextResponse.json(
                { error: "id and Staff_type are required" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `
            UPDATE "Staff"
            SET "Staff_type" = $1
            WHERE id = $2
            RETURNING *;
            `,
            [Staff_type, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Staff not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Role updated successfully",
            user: result.rows[0],
        });

    } catch (err) {
        console.error("❌ Error updating staff role:", err);
        return NextResponse.json(
            { error: "Failed to update role" },
            { status: 500 }
        );
    }
}
