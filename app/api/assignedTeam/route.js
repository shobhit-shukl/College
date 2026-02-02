import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { staff_id } = await req.json();

    if (!staff_id) {
      return NextResponse.json([]);
    }

    const { rows } = await pool.query(
      `
      SELECT *
      FROM "AssignTeamTask"
      WHERE staff_id @> ARRAY[$1]::varchar[]
      ORDER BY created_at DESC
      `,
      [staff_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// Optional safety
export async function GET() {
  return NextResponse.json([], { status: 405 });
}
