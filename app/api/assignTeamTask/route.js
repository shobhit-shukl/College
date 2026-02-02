import { pool } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const query = `
      SELECT *
      FROM public."AssignTeamTask"
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Fetch AssignTeamTask error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { staffIds, title, description } = body;

    // Validation
    if (
      !title ||
      !description ||
      !Array.isArray(staffIds) ||
      staffIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO public."AssignTeamTask"
        (title, title_desc, staff_id)
      VALUES
        ($1, $2, $3)
      RETURNING *;
    `;

    const values = [
      title,
      description,
      staffIds, // array goes directly
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(
      {
        message: "Task assigned successfully",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AssignTeamTask INSERT error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM public."AssignTeamTask"
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete AssignTeamTask error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
