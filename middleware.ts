import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SECRET_KEY } from "./app/api/users/UtilAuth";

const protectedPaths: any = ["/api/users/credit-update"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is protected
  const isProtected = protectedPaths.some((path: any) =>
    pathname.startsWith(path)
  );
  if (isProtected) {
    // Get token from header or cookie
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      // return NextResponse.redirect(new URL("/auth/login", request.url));
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
      // return NextResponse.redirect(new URL("/auth/login", request.url));
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token. Please login first",
        },
        { status: 401 }
      );
    }
  } else {
    return NextResponse.next(); // Public API → no token check
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
