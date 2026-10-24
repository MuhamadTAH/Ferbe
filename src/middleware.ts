import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow internal Next.js assets, public images, fonts, health checks, and API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/_cf_health" ||
    pathname === "/_cf_errors" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Redirect root / directly to /gh-demo for demo showcase
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/gh-demo", req.url));
  }

  // 3. Allow showcase demo pages (GH Phonics Demo & Lesson 1 Conversation Demo)
  if (pathname === "/gh-demo" || pathname === "/lesson-1") {
    return NextResponse.next();
  }

  // 4. Draft / Unreleased Lessons (Not available publicly for now; accessible in local dev or with ?preview=dev)
  if (
    pathname === "/lesson-2" &&
    (process.env.NODE_ENV === "development" ||
      req.nextUrl.searchParams.get("preview") === "dev")
  ) {
    return NextResponse.next();
  }

  // 5. All other pages return 404 for this job showcase
  return NextResponse.rewrite(new URL("/not-found", req.url), { status: 404 });
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|txt)).*)",
  ],
};
