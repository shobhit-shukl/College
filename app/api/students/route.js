import { pool } from "@/lib/db";


// GET Students


import { generateExcel } from "@/lib/excel";

// GET Students (Supports Filtering & Export)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const isExport = searchParams.get('export') === 'true';

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM students";
    let countQuery = "SELECT COUNT(*) FROM students";

    // Create filters conditions
    const conditions = [];
    const values = [];

    // Filter Mappings
    // Param Key -> DB Column
    const filters = [
      { param: 'id', col: 'student_id', type: 'text' },
      { param: 'name', col: 'name', type: 'text' },
      { param: 'course', col: 'course', type: 'text' },
      { param: 'department', col: 'department', type: 'text' },
      { param: 'year', col: 'year', type: 'number' },
      { param: 'sem', col: 'semester', type: 'number' }
    ];

    filters.forEach(({ param, col, type }) => {
      const val = searchParams.get(param);
      if (val) {
        if (type === 'text') {
          conditions.push(`${col} ILIKE $${values.length + 1}`);
          values.push(`%${val}%`);
        } else {
          conditions.push(`${col} = $${values.length + 1}`);
          values.push(val);
        }
      }
    });

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      query += whereClause;
      countQuery += whereClause;
    }

    // For export, return all filtered
    if (isExport) {
      query += " ORDER BY id ASC";
      const result = await pool.query(query, values);
      const fileBuffer = generateExcel(result.rows);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=students_report.xlsx'
        }
      });
    }

    // Return all records (JSON) if requested
    const returnAll = searchParams.get('all') === 'true';
    if (returnAll) {
      query += " ORDER BY id ASC";
      const result = await pool.query(query, values);
      return new Response(JSON.stringify({
        data: result.rows,
        pagination: {
          totalItems: result.rows.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: result.rows.length
        }
      }), { status: 200 });
    }

    // Paginate
    query += ` ORDER BY id ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    const paginatedValues = [...values, limit, offset];

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, paginatedValues),
      pool.query(countQuery, values)
    ]);

    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    return new Response(JSON.stringify({
      data: dataResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    }), { status: 200 });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { student_id, name, course, department, year, semester } = await req.json();

    // Validate
    if ([student_id, name, course, department, year, semester].some(v => v === undefined || v === null || v === '')) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const yearNum = Number(year);
    const semesterNum = Number(semester);

    const result = await pool.query(
      "INSERT INTO students (student_id, name, course, department, year, semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [student_id, name, course, department, yearNum, semesterNum]
    );

    return Response.json({ message: "Inserted", student: result.rows[0] }, { status: 201 });

  } catch (err) {
    console.error("DB POST error:", err);
    return new Response(JSON.stringify({ error: err.message || "Database error" }), { status: 500 });
  }
}


// ADD / EDIT Student
export async function PUT(req) {
  const body = await req.json();

  if (body.id) {
    // EDIT (id exists)
    const result = await pool.query(
      `UPDATE students 
       SET student_id=$1, semester=$2, name=$3, year=$4, course=$5, department=$6
       WHERE id=$7 
       RETURNING *`,
      [
        body.student_id,
        body.semester,
        body.name,
        body.year,
        body.course,
        body.department,
        body.id
      ]
    );
    return Response.json({ message: "Updated", student: result.rows[0] });

  } else {
    // ADD NEW (id auto increments)
    const result = await pool.query(
      `INSERT INTO students (student_id, semester, name, year, course, department)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        body.student_id,
        body.semester,
        body.name,
        body.year,
        body.course,
        body.department
      ]
    );
    return Response.json({ message: "Inserted", student: result.rows[0] });
  }
}

// DELETE Student
export async function DELETE(req) {
  const { id } = await req.json();   // deleting by numeric id

  await pool.query(`DELETE FROM students WHERE id = $1`, [Number(id)]);

  return Response.json({ message: "Deleted" });
}

// PATCH: update specific fields (e.g., pending fee) by id query param
export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id parameter" }), { status: 400 });
    }

    const body = await req.json();

    // Try to find a pending fee key (handles the 'pending _fee' key with a space)
    const pendingKey = Object.keys(body).find(k => k.toLowerCase().includes('pending'));
    const pendingValue = pendingKey ? body[pendingKey] : null;

    if (pendingValue === null || pendingValue === undefined) {
      return new Response(JSON.stringify({ error: "Missing pending fee value in body" }), { status: 400 });
    }

    const result = await pool.query(
      `UPDATE students SET "pending _fee" = $1 WHERE id = $2 RETURNING *`,
      [pendingValue, Number(id)]
    );

    return Response.json({ message: "Updated", student: result.rows[0] }, { status: 200 });
  } catch (err) {
    console.error("DB PATCH error:", err);
    return new Response(JSON.stringify({ error: err.message || "Database error" }), { status: 500 });
  }
}