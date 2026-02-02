import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

import { generateExcel } from "@/lib/excel";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const isExport = searchParams.get('export') === 'true';

    let query = 'SELECT "Book-Id", "Publisher", "Book-Name", "Book-category", "Stock" FROM "Books"';
    const conditions = [];
    const values = [];

    // Optional filtering if added later
    const filters = [
      { param: 'id', col: '"Book-Id"' },
      { param: 'name', col: '"Book-Name"' },
      { param: 'publisher', col: '"Publisher"' },
      { param: 'category', col: '"Book-category"' }
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

    query += ' ORDER BY "id" ASC';

    const result = await pool.query(query, values);

    if (isExport) {
      const fileBuffer = generateExcel(result.rows);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=Books_Report.xlsx'
        }
      });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Book ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const query = `
      UPDATE "Books"
      SET "Book-Name" = $1,
          "Publisher" = $2,
          "Book-category" = $3,
          "Stock" = $4
      WHERE "Book-Id" = $5
      RETURNING *;
    `;

    const values = [
      body["Book-Name"],
      body["Publisher"],
      body["Book-category"],
      body["Stock"],
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "No record found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Book updated!", data: result.rows[0] },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Book ID missing" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM "Books" WHERE "Book-Id" = $1 RETURNING *;`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "No record found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Book deleted!", deleted: result.rows[0] },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Delete Error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      ["Book-Id"]: bookId,
      ["Book-Name"]: bookName,
      ["Publisher"]: publisher,
      ["Book-category"]: category,
      ["Stock"]: stock
    } = body;

    // Validation
    if (!bookId || !bookName || !publisher || !category || stock === undefined) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO "Books" 
      ("Book-Id", "Book-Name", "Publisher", "Book-category", "Stock")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [bookId, bookName, publisher, category, stock];

    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: "Book added successfully!", data: result.rows[0] },
      { status: 201 }
    );

  } catch (err) {
    console.error("❌ POST Error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
