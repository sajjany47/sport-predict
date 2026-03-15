import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SECRET_KEY } from "./app/api/users/UtilAuth";
import { FormatErrorMessage } from "./lib/utils";

const protectedPaths = [
  "/api/stats/list",
  "/api/stats/create",
  "/api/stats/update",
  "/api/stats/search",
  "/api/order/list",
  "/api/order/create",
  "/api/order/update",
  "/api/order/:id",
  "/api/subscription/create",
  "/api/subscription/update",
  "/api/users/credit-update",
  "/api/users/list",
  "/api/users/update",
  "/api/support/create",
  "/api/support/update",
  "/api/support/list",
  "/api/support/:id",
  "/api/payment-intent",
  "/api/users/add-offer-credit",
  "/api/match-details",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized - No token provided" },
      { status: 401 },
    );
  }

  try {
    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, SECRET_KEY);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(payload));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 403 },
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
