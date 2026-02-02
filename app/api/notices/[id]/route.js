import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    const result = await pool.query(
      "DELETE FROM notices WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notice deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
