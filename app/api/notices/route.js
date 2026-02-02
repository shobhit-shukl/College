 import { pool } from "@/lib/db";

 import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM notices ORDER BY id DESC");
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch notices:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch notices" }), { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { title, description, date } = await req.json();

    const result = await pool.query(
      "INSERT INTO notices (title, description, date) VALUES ($1, $2, $3) RETURNING *",
      [title, description, date]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error("Failed to add notice:", err);
    return new Response(JSON.stringify({ error: "Failed to add notice" }), { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    const { id } = await req.json();  // id sent in request body

    const result = await pool.query(
      "DELETE FROM notices WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

 

