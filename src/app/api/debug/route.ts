import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/debug - Debug endpoint to check database data
export async function GET(request: NextRequest) {
  try {
    // Check categories
    const categories = (await query(
      "SELECT COUNT(*) as count FROM exercise_categories"
    )) as any[];
    const categoriesCount = categories[0]?.count || 0;

    // Check exercises
    const exercises = (await query(
      "SELECT COUNT(*) as count FROM exercises"
    )) as any[];
    const exercisesCount = exercises[0]?.count || 0;

    // Get sample data
    const sampleCategories = (await query(
      "SELECT * FROM exercise_categories LIMIT 5"
    )) as any[];
    const sampleExercises = (await query(
      "SELECT * FROM exercises LIMIT 5"
    )) as any[];

    return NextResponse.json({
      message: "Database connection successful",
      data: {
        categoriesCount,
        exercisesCount,
        sampleCategories,
        sampleExercises,
      },
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { error: "Database error", details: error },
      { status: 500 }
    );
  }
}
