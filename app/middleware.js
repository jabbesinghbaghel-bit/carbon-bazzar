import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Protect paths starting with /dashboard
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      // Verify JWT
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next(); // Allow access
    } catch (err) {
      console.error("JWT error:", err);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next(); // Allow other routes
}

// Apply middleware only for /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
