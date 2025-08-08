import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SECRET_KEY } from "./app/api/users/UtilAuth";

const protectedPaths = [""];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is protected
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next(); // Public API → no token check
  }

  // Get token from header or cookie
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }

  try {
    // ✅ Verify token using jose (Edge-compatible)
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Pass user data to API route via custom header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(payload));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    // Invalid token
    return NextResponse.json(
      { success: false, message: "Invalid or expired token." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
