import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { sendPasswordChangedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    // Validate input
    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = (await query("SELECT id FROM users WHERE email = ?", [
      email,
    ])) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    // Send password changed confirmation email (don't block on email failure)
    try {
      await sendPasswordChangedEmail(email);
    } catch (emailError) {
      console.error("Failed to send password changed email:", emailError);
      // Don't fail password reset if email fails
    }

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
