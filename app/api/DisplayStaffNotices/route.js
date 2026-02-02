 import { pool } from "@/lib/db";

 import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    const { department } = body;
    console.log(department);

    if (!department) {
      return NextResponse.json(
        { error: "Department required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT * 
       FROM "StaffNotice" 
       WHERE dept = $1 OR dept = 'All' `,
      [department]
    );

    // return all rows
    return NextResponse.json(result.rows, { status: 200 });

  } catch (err) {
    console.error("Failed to fetch notices:", err);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}
