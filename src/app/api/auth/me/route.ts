import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "XYZ";

export async function GET(request: NextRequest) {
  try {
    console.log("ME API: Request received");
    const authHeader = request.headers.get("authorization");
    console.log("ME API: Auth header exists:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("ME API: No valid auth header");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log("ME API: Token extracted, length:", token.length);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log("ME API: Token verified, userId:", decoded.userId);
      const userId = decoded.userId;

      // Get user data from database
      console.log("ME API: Querying database for user:", userId);
      const users = (await query(
        "SELECT id, email, name, created_at FROM users WHERE id = ?",
        [userId]
      )) as any[];

      console.log("ME API: Database query result, users found:", users.length);

      if (users.length === 0) {
        console.log("ME API: User not found in database");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("ME API: Returning user data:", users[0]);
      return NextResponse.json({
        user: users[0],
      });
    } catch (jwtError) {
      console.log("ME API: JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("ME API: Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
