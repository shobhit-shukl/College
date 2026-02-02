import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Only PDF, PNG, and JPG are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${originalName}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "timetables");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return URL
    const fileUrl = `/uploads/timetables/${filename}`;

    return Response.json(
      {
        success: true,
        file_url: fileUrl,
        filename: originalName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "File upload failed: " + error.message },
      { status: 500 }
    );
  }
}
