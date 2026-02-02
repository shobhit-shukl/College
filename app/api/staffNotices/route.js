 import { pool } from "@/lib/db";

 import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query('select * from "StaffNotice"');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch notices:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch notices" }), { status: 500 });
  }
}



export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, type, department } = body;

    if (!title || !description || !type || !department) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO "StaffNotice" 
       (title, description, type, dept, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [title, description, type, department]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err) {
    console.error("Failed to add notice:", err);
    return NextResponse.json(
      { error: "Failed to add notice" },
      { status: 500 }
    );
  }
}

 

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM "StaffNotice"
       WHERE title = $1
       RETURNING *`,
      [title]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No notice found with this title" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Notice(s) deleted successfully",
        deleted: result.rows,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Failed to delete notice:", err);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}
