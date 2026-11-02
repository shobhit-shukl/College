import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Login page role -> the "Staff_type" a staff member must have to use it
const staffTypeForRole = {
  professor: "professor",
  coordinator: "coordinator",
  dean: "dean",
  hr: "hr",
  librarian: "librarian",
  warden: "warden",
  accountant: "accountant",
  assistantprofessor: "assistantprofessor",
  admin: "admin",
};

const normalize = (value) => String(value || "").toLowerCase().replace(/\s+/g, "");

export async function POST(req) {
  try {
    const { Id, password, role } = await req.json();

    const roleLower = String(role || "").toLowerCase();

    let query;
    let idField;

    if (roleLower === "student") {
      query = `SELECT * FROM students WHERE student_id=$1`;
      idField = "student_id";
    } else if (roleLower === "superadmin") {
      query = `SELECT * FROM "SuperAdmin" WHERE "SuperAdmin_Id"=$1`;
      idField = "SuperAdmin_Id";
    } else if (staffTypeForRole[roleLower]) {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const res = await pool.query(query, [String(Id || "").trim()]);

    if (!res.rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = res.rows[0];

    // ❗ plaintext comparison (OK for now, but hash later)
    if (password !== user.Password) {
      return NextResponse.json({ error: "Wrong password" }, { status: 400 });
    }

    // A staff member can only sign in as the role they hold
    if (idField === "Staff_id" && normalize(user.Staff_type) !== staffTypeForRole[roleLower]) {
      return NextResponse.json(
        { error: `This ID is registered as ${user.Staff_type || "staff"}, not ${role}` },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        id: user[idField],
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        token,
        role,
        id: user[idField],
        name: user.name || user.Staff_name,
        profileUrl: null,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
