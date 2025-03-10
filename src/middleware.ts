import { NextRequest, NextResponse } from "next/server";
import { unprotectedRoutes } from "./lib/constant";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!unprotectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token || token === "error") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
