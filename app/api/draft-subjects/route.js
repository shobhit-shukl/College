 import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }, // enable if using hosted DB
});

/* -------------------------------- GET -------------------------------- */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, course, branch, year, semester, subjects, created_at
       FROM public.draft_subjects
       ORDER BY created_at DESC`
    );

    if (rows.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('GET draft-subjects error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

/* -------------------------------- POST -------------------------------- */
export async function POST(request) {
  try {
    const body = await request.json();
    const { course, branch, year, semester, subjects } = body;

    if (!course || !branch || !year || !semester || !subjects) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO public.draft_subjects
        (course, branch, year, semester, subjects)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      course,
      branch,
      year,
      semester,
      JSON.stringify(subjects),
    ];

    const { rows } = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    // Unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft already exists for this course/branch/year/semester',
        },
        { status: 409 }
      );
    }

    console.error('POST draft-subjects error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save draft' },
      { status: 500 }
    );
  }
}
