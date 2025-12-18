import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Allow login page & NextAuth routes & Next.js internals
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Get NEXTAUTH token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If token exists but admin = false
  if (!token.admin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // protect ONLY dashboard pages
};
