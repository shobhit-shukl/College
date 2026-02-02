  
 import { pool } from "@/lib/db";
 import { NextResponse } from "next/server";
 
  

export async function GET() {
   try {
     const query = `
        SELECT
            A."id",
            A."created_at",
            A."total_leaves",
            A."total_present",
            A."Staff_id",
            S."Staff_name"
        FROM
            "Staff-Attendance" AS A
        INNER JOIN
            "Staff" AS S
        ON
            A."Staff_id" = S."Staff_id";
     `;

     const result = await pool.query(query);

     // The result.rows will contain all the data, including Staff_name
     return NextResponse.json(result.rows);
   } catch (err) {
     console.error("❌ Error fetching staff attendance with details:", err);
     return NextResponse.json(
       { error: "Failed to fetch staff attendance" },
       { status: 500 }
     );
   }
}



 
 