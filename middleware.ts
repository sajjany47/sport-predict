import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SECRET_KEY } from "./app/api/users/UtilAuth";

const protectedPaths: any = [
  // "/api/users/credit-update",
  // "/api/order/create",
  "/api/order/list",
  // "/api/order/update",
];

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
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token-api`,
        {
          method: "POST",
          headers: { cookie: request.headers.get("cookie") || "" },
        }
      );
      console.log(refreshRes.ok);
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        const res = NextResponse.next();

        // set new access token for this request
        res.headers.set("authorization", `Bearer ${accessToken}`);

        // forward any cookies (refresh token) set by API
        const setCookie = refreshRes.headers.get("set-cookie");
        if (setCookie) {
          res.headers.set("set-cookie", setCookie);
        }

        return res;
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token. Please login first",
          },
          { status: 401 }
        );
      }
    }
  } else {
    return NextResponse.next(); // Public API → no token check
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
