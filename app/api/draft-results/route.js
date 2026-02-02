// pages/api/draft-results.js
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch all draft results
import { generateExcel } from "@/lib/excel";

// GET: Fetch all draft results
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isExport = url.searchParams.get('export') === 'true';

    const result = await pool.query(`
      SELECT 
        id, "Student_id", "Year", semester, "Rank", "Exam_type", 
        subjects, marks, total_marks, "CGPA", created_at
      FROM public.students_result
      ORDER BY id ASC
    `);

    if (isExport) {
      const data = result.rows.map(row => ({
        ...row,
        subjects: Array.isArray(row.subjects) ? row.subjects.join(", ") : row.subjects,
        marks: Array.isArray(row.marks) ? row.marks.join(", ") : row.marks,
        total_marks: Array.isArray(row.total_marks) ? row.total_marks.join(", ") : row.total_marks,
      }));

      const fileBuffer = generateExcel(data);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=DraftResults_Report.xlsx'
        }
      });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching draft results:", err);
    return NextResponse.json({ error: "Failed to fetch draft results" }, { status: 500 });
  }
}

// POST: Insert new draft result
export async function POST(req) {
  try {
    const body = await req.json();
    const { Student_id, Year, semester, Rank, Exam_type, subjects, marks, total_marks } = body;

    console.log('POST /api/draft-results body:', JSON.stringify(body));

    if (!Student_id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    if (
      !Array.isArray(subjects) ||
      !Array.isArray(marks) ||
      !Array.isArray(total_marks) ||
      subjects.length !== marks.length ||
      marks.length !== total_marks.length
    ) {
      return NextResponse.json(
        { error: "Subjects, marks, and total_marks arrays must have same length" },
        { status: 400 }
      );
    }

    // Simple CGPA calculation (example: total_obtained / total_possible * 10)
    let totalObtained = Array.isArray(marks) ? marks.reduce((sum, m) => sum + Number(m || 0), 0) : 0;
    let totalPossible = Array.isArray(total_marks) ? total_marks.reduce((sum, m) => sum + Number(m || 0), 0) : 0;
    const CGPA = totalPossible === 0 ? 0 : (totalObtained / totalPossible) * 10;

    console.log('Computed CGPA:', CGPA, { totalObtained, totalPossible });

    const query = `
      INSERT INTO public.students_result
        ("Student_id", "Year", semester, "Rank", "Exam_type", subjects, marks, total_marks, "CGPA")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [Student_id, Year, semester, Rank, Exam_type, subjects, marks, total_marks, CGPA];
    console.log('DB insert values:', values);

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Error inserting draft result:", err?.message || err, err?.stack || 'no-stack');
    const message = (err && err.message) ? err.message : 'Failed to insert draft result';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove a draft result by Student_id
export async function DELETE(req) {
  try {
    const { Student_id } = await req.json();
    if (!Student_id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    await pool.query(`DELETE FROM public.students_result WHERE "Student_id" = $1`, [Student_id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting draft result:", err);
    return NextResponse.json({ error: "Failed to delete draft result" }, { status: 500 });
  }
}
