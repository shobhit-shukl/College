import { pool } from "@/lib/db";

// Serves a timetable stored inline as a data URL, so it can be opened in a
// new tab or used as an <img> src (browsers block navigating to data: URLs)
export async function GET(req) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    const { rows } = await pool.query(`SELECT file_url FROM timetable WHERE id = $1`, [id]);
    if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });

    const fileUrl = rows[0].file_url || "";
    const match = fileUrl.match(/^data:([^;]+);base64,(.*)$/s);
    if (!match) return Response.redirect(new URL(fileUrl, req.url), 302);

    return new Response(Buffer.from(match[2], "base64"), {
      headers: {
        "Content-Type": match[1],
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error("Timetable file error:", error);
    return Response.json({ error: "Failed to load file" }, { status: 500 });
  }
}
