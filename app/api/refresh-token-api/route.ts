import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { generateToken, SECRET_KEY } from "../users/UtilAuth";
import { serialize } from "cookie";

export const POST = async (request: NextRequest) => {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const refreshToken = cookieHeader.split("refreshToken=")[1]?.split(";")[0];

    if (!refreshToken) {
      return NextResponse.json(
        { status: false, message: "No refresh token provided" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(refreshToken, SECRET_KEY);

    const newAccessToken = await generateToken({ ...payload }, "15m");

    const newRefreshToken = await generateToken({ ...payload }, "1d");

    // set refresh token in secure cookie
    const cookie = serialize("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // still secure in prod
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    const response = NextResponse.json(
      {
        status: true,
        accessToken: newAccessToken,
        message: "Token generated successfully",
      },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Invalid refresh token" },
      { status: 403 }
    );
  }
};
