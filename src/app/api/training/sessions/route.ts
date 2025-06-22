import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "XYZ";

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET /api/training/sessions - Get user's training sessions
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const exercise = searchParams.get("exercise");

    // If category or exercise is specified, get exercise history
    if (category || exercise) {
      let sql = `
        SELECT 
          ts.start_time,
          ts.session_data
        FROM training_sessions ts
        WHERE ts.user_id = ? AND ts.status = 'completed'
        ORDER BY ts.start_time DESC
        LIMIT 100
      `;
      const params: any[] = [user.userId];

      const sessions = (await query(sql, params)) as any[];

      const exerciseHistory: { [key: string]: string } = {};

      for (const session of sessions) {
        try {
          const sessionData = JSON.parse(session.session_data || "{}");
          const exercises = sessionData.exercises || [];

          for (const exerciseData of exercises) {
            const exerciseName = exerciseData.exerciseName;
            const exerciseCategory = exerciseData.category;

            // If we're filtering by category
            if (category && exerciseCategory !== category) {
              continue;
            }

            // If we're filtering by exercise name
            if (exercise && exerciseName !== exercise) {
              continue;
            }

            // Store the most recent date for this exercise/category
            const dateKey = exercise ? exerciseName : exerciseCategory;
            if (!exerciseHistory[dateKey]) {
              exerciseHistory[dateKey] = session.start_time;
            }
          }
        } catch (e) {
          console.error("Error parsing session data:", e);
        }
      }

      return NextResponse.json({ exerciseHistory });
    }

    // Regular sessions query
    let sql = `
      SELECT id, session_name, session_data, total_time, start_time, end_time, status, notes, created_at
      FROM training_sessions 
      WHERE user_id = ?
    `;
    const params: any[] = [user.userId];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY start_time DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const sessions = (await query(sql, params)) as any[];

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Get training sessions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/training/sessions - Create new training session
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { session_name, session_data, total_time, notes } =
      await request.json();

    // Validate input
    if (!session_data || !total_time) {
      return NextResponse.json(
        { error: "Session data and total time are required" },
        { status: 400 }
      );
    }

    if (total_time <= 0) {
      return NextResponse.json(
        { error: "Total time must be greater than 0" },
        { status: 400 }
      );
    }

    // Create training session
    const result = (await query(
      `INSERT INTO training_sessions 
       (user_id, session_name, session_data, total_time, start_time, status, notes) 
       VALUES (?, ?, ?, ?, NOW(), 'active', ?)`,
      [
        user.userId,
        session_name,
        JSON.stringify(session_data),
        total_time,
        notes,
      ]
    )) as any;

    // Get the created session
    const sessions = (await query(
      "SELECT * FROM training_sessions WHERE id = ?",
      [result.insertId]
    )) as any[];

    return NextResponse.json(
      {
        message: "Training session created successfully",
        session: sessions[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create training session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
