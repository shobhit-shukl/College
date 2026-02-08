import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all academic years
export async function GET(req) {
  try {
    const query = `
      SELECT id, name, start_date, end_date, is_active, created_at, updated_at
      FROM academic_years
      ORDER BY start_date DESC
    `;
    
    const result = await pool.query(query);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return NextResponse.json(
      { error: "Failed to fetch academic years" },
      { status: 500 }
    );
  }
}

// POST create new academic year
export async function POST(req) {
  try {
    const body = await req.json();
    const { start_date, end_date, is_active } = body;

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Generate name from dates (e.g., "2025-2026")
    const startYear = new Date(start_date).getFullYear();
    const endYear = new Date(end_date).getFullYear();
    const name = `${startYear}-${endYear}`;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // If this year should be active, deactivate all others
      if (is_active) {
        await client.query('UPDATE academic_years SET is_active = false');
      }

      // Insert new academic year
      const insertQuery = `
        INSERT INTO academic_years (name, start_date, end_date, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await client.query(insertQuery, [
        name,
        start_date,
        end_date,
        is_active || false
      ]);

      await client.query('COMMIT');
      
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating academic year:", error);
    return NextResponse.json(
      { error: "Failed to create academic year" },
      { status: 500 }
    );
  }
}

// PATCH update academic year (activate/deactivate)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Academic year ID is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // If activating this year, deactivate all others
      if (is_active) {
        await client.query('UPDATE academic_years SET is_active = false');
      }

      // Update the specified year
      const updateQuery = `
        UPDATE academic_years
        SET is_active = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, [is_active, id]);

      await client.query('COMMIT');
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Academic year not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating academic year:", error);
    return NextResponse.json(
      { error: "Failed to update academic year" },
      { status: 500 }
    );
  }
}
