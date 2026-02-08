import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all departments with school information
export async function GET(req) {
  try {
    const query = `
      SELECT 
        d.id, 
        d.school_id,
        d.name, 
        d.code, 
        d.description, 
        d.hod_name, 
        d.contact_email, 
        d.is_active, 
        d.created_at,
        s.name as school_name,
        s.code as school_code
      FROM departments d
      LEFT JOIN schools s ON d.school_id = s.id
      ORDER BY s.name ASC, d.name ASC
    `;
    
    const result = await pool.query(query);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Check if table doesn't exist
    if (error.code === '42P01') {
      return NextResponse.json(
        { 
          error: "Departments table does not exist",
          details: "Please run the SQL script from database/departments_setup.sql in your Supabase SQL Editor"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch departments", details: error.message },
      { status: 500 }
    );
  }
}

// POST create new department
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      school_id,
      name, 
      code, 
      description, 
      hod_name, 
      contact_email, 
      is_active 
    } = body;

    if (!school_id) {
      return NextResponse.json(
        { error: "School is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    // Check if code already exists
    if (code) {
      const checkQuery = 'SELECT id FROM departments WHERE code = $1';
      const checkResult = await pool.query(checkQuery, [code]);
      
      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          { error: "Department code already exists" },
          { status: 400 }
        );
      }
    }

    // Verify school exists
    const schoolCheckQuery = 'SELECT id FROM schools WHERE id = $1';
    const schoolCheck = await pool.query(schoolCheckQuery, [school_id]);
    
    if (schoolCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Selected school does not exist" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO departments (
        school_id, name, code, description, hod_name, contact_email, 
        is_active, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [
      school_id,
      name,
      code || null,
      description || null,
      hod_name || null,
      contact_email || null,
      is_active !== undefined ? is_active : true
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH update department
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { 
      id,
      school_id, 
      name, 
      code, 
      description, 
      hod_name, 
      contact_email, 
      is_active 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    if (!school_id) {
      return NextResponse.json(
        { error: "School is required" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    // Check if code already exists for other departments
    if (code) {
      const checkQuery = 'SELECT id FROM departments WHERE code = $1 AND id != $2';
      const checkResult = await pool.query(checkQuery, [code, id]);
      
      if (checkResult.rows.length > 0) {
        return NextResponse.json(
          { error: "Department code already exists" },
          { status: 400 }
        );
      }
    }

    // Verify school exists
    const schoolCheckQuery = 'SELECT id FROM schools WHERE id = $1';
    const schoolCheck = await pool.query(schoolCheckQuery, [school_id]);
    
    if (schoolCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Selected school does not exist" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE departments
      SET school_id = $1, name = $2, code = $3, description = $4, 
          hod_name = $5, contact_email = $6, is_active = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      school_id,
      name,
      code || null,
      description || null,
      hod_name || null,
      contact_email || null,
      is_active !== undefined ? is_active : true,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE department
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    // Check if any courses are linked to this department
    const checkCoursesQuery = `
      SELECT COUNT(*) as count 
      FROM courses 
      WHERE department_id = $1
    `;
    
    let courseCount = 0;
    try {
      const checkResult = await pool.query(checkCoursesQuery, [id]);
      courseCount = parseInt(checkResult.rows[0].count);
    } catch (error) {
      // If courses table doesn't exist, proceed with deletion
      console.log("Courses table may not exist, proceeding with deletion");
    }

    if (courseCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete department. Courses are linked." },
        { status: 400 }
      );
    }

    const deleteQuery = 'DELETE FROM departments WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Failed to delete department", details: error.message },
      { status: 500 }
    );
  }
}
