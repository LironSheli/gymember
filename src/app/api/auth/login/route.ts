import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "gymember_super_secret_jwt_key_2024_secure_and_random";

export async function POST(request: NextRequest) {
  try {
    console.log("Login API: Request received");
    const { email, password } = await request.json();
    console.log("Login API: Email provided:", email);

    // Validate input
    if (!email || !password) {
      console.log("Login API: Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    console.log("Login API: Querying database for user");
    const users = (await query(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email]
    )) as any[];

    console.log("Login API: Database query result, users found:", users.length);

    if (users.length === 0) {
      console.log("Login API: User not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log("Login API: User found, ID:", user.id);

    // Verify password
    console.log("Login API: Verifying password");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("Login API: Password valid:", isValidPassword);

    if (!isValidPassword) {
      console.log("Login API: Invalid password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token with 30 days expiration
    console.log("Login API: Generating JWT token");
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("Login API: Token generated, length:", token.length);

    // Get user data including name
    console.log("Login API: Getting user data");
    const userData = (await query(
      "SELECT id, email, name, created_at FROM users WHERE id = ?",
      [user.id]
    )) as any[];

    console.log("Login API: User data retrieved:", userData[0]);

    // Return token in response body for localStorage
    return NextResponse.json(
      {
        message: "Login successful",
        user: userData[0],
        token: token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API: Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
