// app/api/AuthStudents/route.js
 import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
 
 export async function GET() {
   try {
     const result = await pool.query(
        ' select * from "Tasks"'
     );
 
     return NextResponse.json(result.rows);
   } catch (err) {
     console.error("❌ Error fetching staff:", err);
     return NextResponse.json(
       { error: "Failed to fetch staff" },
       { status: 500 }
     );
   }
 }
 


 
export async function POST(request) {
  try {
    const body = await request.json();
    const {   title, description, dept , Priority } = body;

    if (  !title || !description || !dept   || !Priority) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO "Tasks" ( "Task_title", "Task_desc", "dept",  "Priority")
       VALUES ($1, $2, $3, $4 ) RETURNING *`,
      [ title, description, dept,  Priority]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("❌ Error creating task:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const body = await req.json();
    const { Task_title } = body;

    if (!Task_title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM "Tasks"  WHERE "Task_title" = $1 RETURNING *`,
      [Task_title]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No Tasks found with this title" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Task(s) deleted successfully",
        deleted: result.rows,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Failed to delete Tasks:", err);
    return NextResponse.json(
      { error: "Failed to delete Tasks" },
      { status: 500 }
    );
  }
}
