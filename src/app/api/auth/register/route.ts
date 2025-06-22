import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "gymember_super_secret_jwt_key_2024_secure_and_random";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = (await query("SELECT id FROM users WHERE email = ?", [
      email,
    ])) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = (await query(
      "INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())",
      [email, hashedPassword, name.trim()]
    )) as any;

    // Get the created user data
    const userData = (await query(
      "SELECT id, email, name, created_at FROM users WHERE id = ?",
      [result.insertId]
    )) as any[];

    // Generate JWT token with 30 days expiration
    const token = jwt.sign(
      { userId: result.insertId, email: email },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Send welcome email (don't block on email failure)
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userData[0],
        token: token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
