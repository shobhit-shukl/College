import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { id } = await req.json();
    console.log("Received ID:", id);

    const result = await pool.query(
      `SELECT * FROM "leave" WHERE "employee" = $1`,
      [id]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
