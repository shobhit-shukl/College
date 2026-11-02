// app/api/issue-book/route.js
import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

// Books are lent for two weeks
const LOAN_DAYS = 14;

// GET handler to fetch all records
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT ib.*, COALESCE(ib.book_name, b."Book-Name") AS book_name, s.name AS student_name
       FROM "Issue-Books" ib
       LEFT JOIN "Books" b ON b."Book-Id" = ib.book_id
       LEFT JOIN students s ON s.student_id = ib.student_id
       ORDER BY ib.issue_date DESC, ib.id DESC`
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

// POST handler to issue a book: checks the student and stock, records the
// loan with its due date and takes one copy off the shelf
export async function POST(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const staff_id = String(body.staff_id || '').trim();
    const student_id = String(body.student_id || '').trim();
    const book_id = String(body.book_id || '').trim();
    const issue_date = body.issue_date;

    if (!staff_id || !student_id || !book_id || !issue_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const student = await client.query(`SELECT 1 FROM students WHERE student_id = $1`, [student_id]);
    if (!student.rowCount) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: `No student with ID ${student_id}` }, { status: 404 });
    }

    const book = await client.query(
      `SELECT "Book-Name", "Stock" FROM "Books" WHERE "Book-Id" = $1 FOR UPDATE`,
      [book_id]
    );
    if (!book.rowCount) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: `No book with ID ${book_id}` }, { status: 404 });
    }
    if (Number(book.rows[0].Stock) <= 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: "No copies of this book are in stock" }, { status: 409 });
    }

    const result = await client.query(
      `INSERT INTO "Issue-Books" (staff_id, student_id, book_id, book_name, issue_date, return_date)
       VALUES ($1, $2, $3, $4, $5::date, $5::date + $6::int)
       RETURNING *`,
      [staff_id, student_id, book_id, book.rows[0]['Book-Name'], issue_date, LOAN_DAYS]
    );
    await client.query(`UPDATE "Books" SET "Stock" = "Stock" - 1 WHERE "Book-Id" = $1`, [book_id]);

    await client.query('COMMIT');

    return NextResponse.json(
      { message: "Book issued successfully", data: result.rows[0] },
      { status: 201 }
    );

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error("❌ Error issuing book:", err);
    return NextResponse.json(
      { error: "Database error: " + err.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PATCH handler to mark a loan returned and put the copy back in stock
export async function PATCH(request) {
  const client = await pool.connect();
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE "Issue-Books" SET returned = true WHERE id = $1 AND NOT returned RETURNING *`,
      [id]
    );
    if (!result.rowCount) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: "Loan not found or already returned" }, { status: 404 });
    }
    await client.query(`UPDATE "Books" SET "Stock" = "Stock" + 1 WHERE "Book-Id" = $1`, [result.rows[0].book_id]);
    await client.query('COMMIT');

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error("❌ Error returning book:", err);
    return NextResponse.json({ error: "Database error: " + err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
