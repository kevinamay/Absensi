import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
  let session: any = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch (e) {
      // Cookie corrupted or invalid
      session = null;
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const isProtectedIntern = pathname.startsWith("/intern") || pathname.startsWith("/dashboard");
  const isProtectedAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";

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

  // 3. Redirect away from Login page if already authenticated with active whitelist session
  if (isAuthPage && session?.email) {
    if (session.role === "admin" || session.role === "supervisor") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (session.whitelisted) {
      return NextResponse.redirect(new URL("/intern", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/intern/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/admin/login",
  ],
};
