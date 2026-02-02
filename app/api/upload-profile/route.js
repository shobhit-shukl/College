import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = requireAuth(req);
    const { id, role: bodyRole, image } = await req.json();

    if (!id || !bodyRole || !image) {
      return NextResponse.json({ error: "id, role and image are required" }, { status: 400 });
    }

    // allow student to upload only their own image; staff/superadmin allowed for any
    if (user.role === "student" && String(user.id) !== String(id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // image is expected as data URL: data:<mime>;base64,<data>
    const match = image.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Invalid image data" }, { status: 400 });

    const mime = match[1];
    const ext = mime.split("/")[1];
    const data = Buffer.from(match[2], "base64");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // ensure filename uses the target role (student files use `student-<id>-...`)
    const targetRole = bodyRole === "student" ? "student" : (bodyRole || user.role || "user");
    const filename = `${targetRole}-${id}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filepath, data);

    const url = `/uploads/${filename}`; // served from public/

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
