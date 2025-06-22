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

// GET /api/training/sessions/[id] - Get specific training session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionId = parseInt(id);
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const sessions = (await query(
      "SELECT * FROM training_sessions WHERE id = ? AND user_id = ?",
      [sessionId, user.userId]
    )) as any[];

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: "Training session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ session: sessions[0] });
  } catch (error) {
    console.error("Get training session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/training/sessions/[id] - Update training session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionId = parseInt(id);
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const { session_name, session_data, total_time, status, notes, end_time } =
      await request.json();

    // Check if session exists and belongs to user
    const existingSessions = (await query(
      "SELECT id FROM training_sessions WHERE id = ? AND user_id = ?",
      [sessionId, user.userId]
    )) as any[];

    if (existingSessions.length === 0) {
      return NextResponse.json(
        { error: "Training session not found" },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (session_name !== undefined) {
      updates.push("session_name = ?");
      values.push(session_name);
    }

    if (session_data !== undefined) {
      updates.push("session_data = ?");
      values.push(JSON.stringify(session_data));
    }

    if (total_time !== undefined) {
      updates.push("total_time = ?");
      values.push(total_time);
    }

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }

    if (end_time !== undefined) {
      updates.push("end_time = ?");
      values.push(end_time);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    values.push(sessionId, user.userId);

    const sql = `UPDATE training_sessions SET ${updates.join(
      ", "
    )} WHERE id = ? AND user_id = ?`;
    await query(sql, values);

    // Get updated session
    const sessions = (await query(
      "SELECT * FROM training_sessions WHERE id = ?",
      [sessionId]
    )) as any[];

    return NextResponse.json({
      message: "Training session updated successfully",
      session: sessions[0],
    });
  } catch (error) {
    console.error("Update training session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/training/sessions/[id] - Delete training session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionId = parseInt(id);
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Check if session exists and belongs to user
    const existingSessions = (await query(
      "SELECT id FROM training_sessions WHERE id = ? AND user_id = ?",
      [sessionId, user.userId]
    )) as any[];

    if (existingSessions.length === 0) {
      return NextResponse.json(
        { error: "Training session not found" },
        { status: 404 }
      );
    }

    // Delete session
    await query("DELETE FROM training_sessions WHERE id = ? AND user_id = ?", [
      sessionId,
      user.userId,
    ]);

    return NextResponse.json({
      message: "Training session deleted successfully",
    });
  } catch (error) {
    console.error("Delete training session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
