import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Skip middleware for auth routes
  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // For other API routes, just check if Authorization header exists
  // Let the individual API routes handle JWT verification
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Pass through to API route for JWT verification
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
