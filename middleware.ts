import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SECRET_KEY } from "./app/api/users/UtilAuth";
import { FormatErrorMessage } from "./lib/utils";

const protectedPaths: any = [
  "/api/stats/list",
  "/api/stats/create",
  "/api/stats/update",
  "/api/stats/search",
  "/api/order/list",
  "/api/order/create",
  "/api/order/update",
  "api/order/:id",
  "/api/subscription/create",
  "/api/subscription/update",
  "/api/users/credit-update",
  "/api/users/list",
  "/api/users/update",
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

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user", JSON.stringify(payload));

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      // const refreshRes = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token-api`,
      //   {
      //     method: "POST",
      //     headers: {
      //       cookie: request.headers.get("cookie") || "",
      //     },
      //   }
      // );

      // if (refreshRes.ok) {
      //   console.log("first");
      //   const { accessToken } = await refreshRes.json();

      //   const requestHeaders = new Headers(request.headers);
      //   requestHeaders.set("authorization", `Bearer ${accessToken}`);
      //   const { payload } = await jwtVerify(accessToken, SECRET_KEY);
      //   requestHeaders.set("x-user", JSON.stringify(payload));
      //   const res = NextResponse.next({ request: { headers: requestHeaders } });

      //   const setCookie = refreshRes.headers.get("set-cookie");
      //   if (setCookie) {
      //     res.headers.set("set-cookie", setCookie);
      //   }

      //   return res;
      // } else {
      //   return NextResponse.json(
      //     {
      //       success: false,
      //       message: "Invalid or expired token. Please login first",
      //     },
      //     { status: 401 }
      //   );
      // }

      return NextResponse.json(
        {
          success: false,
          message: FormatErrorMessage(error),
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
