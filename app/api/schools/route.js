import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all schools
export async function GET(req) {
  try {
    // First, check if updated_at column exists
    let hasUpdatedAt = true;
    try {
      const checkColumnQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'schools' AND column_name = 'updated_at'
      `;
      const checkResult = await pool.query(checkColumnQuery);
      hasUpdatedAt = checkResult.rows.length > 0;
    } catch (err) {
      console.log("Could not check for updated_at column, assuming it exists");
    }

    const query = hasUpdatedAt
      ? `
        SELECT id, name, code, description, dean_name, contact_email, 
               contact_phone, is_active, created_at, updated_at
        FROM schools
        ORDER BY name ASC
      `
      : `
        SELECT id, name, code, description, dean_name, contact_email, 
               contact_phone, is_active, created_at, 
               created_at as updated_at
        FROM schools
        ORDER BY name ASC
      `;
    
    const result = await pool.query(query);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching schools:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Check if table doesn't exist
    if (error.code === '42P01') {
      return NextResponse.json(
        { 
          error: "Schools table does not exist",
          details: "The schools table exists in your database. Please check your DATABASE_URL connection string."
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch schools", details: error.message },
      { status: 500 }
    );
  }
}

// POST create new school
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      name, 
      code, 
      description, 
      dean_name, 
      contact_email, 
      contact_phone, 
      is_active 
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "School name is required" },
        { status: 400 }
      );
    }

    // Check if code already exists
    if (code) {
      const checkQuery = 'SELECT id FROM schools WHERE code = $1';
      const checkResult = await pool.query(checkQuery, [code]);
      
      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          { error: "School code already exists" },
          { status: 400 }
        );
      }
    }

    const insertQuery = `
      INSERT INTO schools (
        name, code, description, dean_name, contact_email, 
        contact_phone, is_active, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      name,
      code || null,
      description || null,
      dean_name || null,
      contact_email || null,
      contact_phone || null,
      is_active !== undefined ? is_active : true
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}

// PATCH update school
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { 
      id, 
      name, 
      code, 
      description, 
      dean_name, 
      contact_email, 
      contact_phone, 
      is_active 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "School ID is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "School name is required" },
        { status: 400 }
      );
    }

    // Check if code already exists for other schools
    if (code) {
      const checkQuery = 'SELECT id FROM schools WHERE code = $1 AND id != $2';
      const checkResult = await pool.query(checkQuery, [code, id]);
      
      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          { error: "School code already exists" },
          { status: 400 }
        );
      }
    }

    const updateQuery = `
      UPDATE schools
      SET name = $1, code = $2, description = $3, dean_name = $4, 
          contact_email = $5, contact_phone = $6, is_active = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      name,
      code || null,
      description || null,
      dean_name || null,
      contact_email || null,
      contact_phone || null,
      is_active !== undefined ? is_active : true,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating school:", error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

// DELETE school
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "School ID is required" },
        { status: 400 }
      );
    }

    // Check if any departments are linked to this school
    const checkDepartmentsQuery = `
      SELECT COUNT(*) as count 
      FROM departments 
      WHERE school_id = $1
    `;
    
    let departmentCount = 0;
    try {
      const checkResult = await pool.query(checkDepartmentsQuery, [id]);
      departmentCount = parseInt(checkResult.rows[0].count);
    } catch (error) {
      // If departments table doesn't exist, proceed with deletion
      console.log("Departments table may not exist, proceeding with deletion");
    }

    if (departmentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete school. Departments are linked." },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM schools WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "School deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
