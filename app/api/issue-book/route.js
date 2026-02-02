// app/api/issue-book/route.js
import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

// GET handler to fetch all records
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM "Issue-Books" ORDER BY issue_date DESC'
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching records:", err);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST handler to create a new record
export async function POST(request) {
  try {
    // 1. Parse the JSON body from the request
    const body = await request.json();
    const { staff_id, student_id, book_id, issue_date } = body;

    // 2. Simple Validation
    if (!staff_id || !student_id || !book_id || !issue_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Run the INSERT query
    // Note: Using double quotes for the table name "Issue-Books" because of the hyphen
    const query = `
      INSERT INTO "Issue-Books" (staff_id, student_id, book_id, issue_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [staff_id, student_id, book_id, issue_date];
    
    const result = await pool.query(query, values);

    // 4. Return the newly created record
    return NextResponse.json(
      { message: "Book issued successfully", data: result.rows[0] },
      { status: 201 }
    );

  } catch (err) {
    console.error("❌ Error issuing book:", err);
    return NextResponse.json(
      { error: "Database error: " + err.message },
      { status: 500 }
    );
  }
}