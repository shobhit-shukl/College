import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ===== GET : Fetch all rooms ===== */
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM "Hostel_Rooms"');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching records:", err);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

/* ===== POST : Add new room ===== */
export async function POST(request) {
  try {
    const body = await request.json();
    const { room_no, room_type, Status } = body;

    if (!room_no || !room_type) {
      return NextResponse.json(
        { error: "Room number and type required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO "Hostel_Rooms" (room_no, room_type, "Status")
       VALUES ($1, $2, $3)
       RETURNING *`,
      [room_no, room_type, Status || "Available"]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("❌ Error adding room:", err);
    return NextResponse.json(
      { error: "Failed to add room" },
      { status: 500 }
    );
  }
}
