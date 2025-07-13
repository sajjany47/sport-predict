import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { verifyToken } from "./app/api/auth/UtilAuth";

const protectedPaths = [
  "/api/orders",
  "/api/subscriptions",
  "/api/user/profile",
];

export function middleware(request: NextRequest) {
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Access denied. No token provided." },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);

    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(decoded));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/orders/:path*",
    "/api/subscriptions/:path*",
    "/api/user/:path*",
  ],
};
