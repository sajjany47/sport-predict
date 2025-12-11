import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "6bf6680598a374557023eabfc280e3e930bf080b"
);
export async function generateToken(payload: any, expiresIn: string) {
  let data = {
    _id: payload._id.toString(),
    name: payload.name,
    email: payload.email,
    mobileNumber: payload.mobileNumber,
    username: payload.username,
    role: payload.role,
    isActive: payload.isActive,
    credits: Number(payload.credits ?? 0),
    agreeToTerms: payload.agreeToTerms,
  };

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for HMAC
    .setExpirationTime(expiresIn) // Expiration time
    .sign(SECRET_KEY);
}

export const GenerateOTP = (date: any) => {
  const timestamp = date.getTime();

  // Create a 6 digit OTP by taking modulo
  const otp = String(timestamp % 1_000_000).padStart(6, "0");

  return otp;
};

export async function GenerateOTPToken(payload: any) {
  let data = {
    createdAt: payload.createdAt,
    email: payload.email,
    otp: payload.otp,
    isVerified: payload.isVerified,
  };

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for HMAC
    .setExpirationTime("5m") // Expiration time
    .sign(SECRET_KEY);
}

export const VerifyOTPToken = async (body: any) => {
  const cookieStore: any = cookies();
  const otpToken = cookieStore.get("otp_token")?.value;
  if (!otpToken) {
    return NextResponse.json(
      {
        success: false,
        message: "OTP token is missing or expired.",
      },
      { status: 400 }
    );
  }
  const payload: any = await jwtVerify(otpToken, SECRET_KEY);
  const otp = GenerateOTP(payload.createdAt);

  const now = new Date();
  const diffMs = now.getTime() - new Date(payload.createdAt).getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (
    diffMinutes > 5 ||
    payload.otp !== body.otp ||
    payload.email !== body.email ||
    payload.otp !== otp
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "OTP has expired!",
      },
      { status: 400 }
    );
  }
  const newOtpToken = await GenerateOTPToken({
    createdAt: payload.createdAt,
    email: body.email,
    otp: otp,
    isVerified: true,
  });

  return { token: newOtpToken, payload: payload };
};
