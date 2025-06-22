import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const users = (await query("SELECT id FROM users WHERE email = ?", [
      email,
    ])) as any[];

    if (users.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        {
          message:
            "If an account with this email exists, a password reset link has been sent",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll update the user table with a temporary reset token
    await query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [resetToken, resetTokenExpiry, email]
    );

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "If an account with this email exists, a password reset link has been sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
