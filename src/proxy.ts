import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { SessionData } from "@/types/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API requests and public static assets pass through
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract session cookie (set upon successful Firestore whitelist verification)
  const sessionCookie = request.cookies.get("cv_asia_session")?.value;
  let session: SessionData | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie)) as SessionData;
    } catch {
      // Cookie corrupted or invalid
      session = null;
    }
  }
  const isProtectedIntern = pathname.startsWith("/intern") || pathname.startsWith("/dashboard");
  const isProtectedAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // 0. Root / always redirects immediately to /login so the landing page is strictly the Login portal
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 1. Strict Route Protection for Intern Dashboard
  if (isProtectedIntern) {
    if (!session || !session.email || !session.whitelisted) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "session_required");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Route Protection for HR / Supervisor Admin Panel
  if (isProtectedAdmin) {
    if (!session || (session.role !== "admin" && session.role !== "supervisor")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 3. Visiting /login: Always allow access to login page and wipe session cookie so user gets a clean form
  if (pathname === "/login") {
    if (sessionCookie) {
      const response = NextResponse.next();
      response.cookies.delete("cv_asia_session");
      return response;
    }
    return NextResponse.next();
  }

  // 4. Visiting /admin/login
  if (pathname === "/admin/login") {
    if (session?.email && (session.role === "admin" || session.role === "supervisor")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // If an intern session is active, automatically wipe the intern session cookie
    if (session && session.role !== "admin" && session.role !== "supervisor") {
      const response = NextResponse.next();
      response.cookies.delete("cv_asia_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/intern/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/admin/login",
  ],
};
