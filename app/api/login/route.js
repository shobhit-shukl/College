"use server";

import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { Id, password, role } = await req.json();

    const inputRole = role;
    const roleLower = String(role || "").toLowerCase();
    console.log("LOGIN ATTEMPT:", { Id, role, roleLower });

    let query;
    let idField;

    if (roleLower === "student") {
      query = `SELECT * FROM students WHERE student_id=$1`;
      idField = "student_id";
    } else if (roleLower === "staff") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "superadmin") {
      query = `SELECT * FROM "SuperAdmin" WHERE "SuperAdmin_Id"=$1`;
      idField = "Super_id";
    } else if (roleLower === "hr") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "professor") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "coordinator") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "dean") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "warden") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "librarian") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "accountant") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "assistantprofessor") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else if (roleLower === "admin") {
      query = `SELECT * FROM "Staff" WHERE "Staff_id"=$1`;
      idField = "Staff_id";
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const res = await pool.query(query, [Id]);

    if (!res.rows.length) {
      console.warn("LOGIN: user not found for", { Id, role });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = res.rows[0];
    console.log("LOGIN: user found for", { Id, role: inputRole, dbId: user[idField] });

    // ❗ plaintext comparison (OK for now, but hash later)
    if (password !== user.Password) {
      console.warn("LOGIN: password mismatch for", { Id, role });
      return NextResponse.json({ error: "Wrong password" }, { status: 400 });
    }

    const token = jwt.sign(
      {
        id: user[idField],
        role: inputRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // try to find a profile image in public/uploads matching role-id
    let profileUrl = null;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(uploadsDir)) {
        const files = await fs.promises.readdir(uploadsDir);
        const prefix = `${role}-${user[idField]}`;
        const match = files.find((f) => f.startsWith(prefix));
        if (match) profileUrl = `/uploads/${match}`;
      }
    } catch (e) {
      console.warn("profile lookup failed", e);
    }

    return NextResponse.json(
      {
        token,
        role,
        id: user[idField],
        name: user.name,
        profileUrl,
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
