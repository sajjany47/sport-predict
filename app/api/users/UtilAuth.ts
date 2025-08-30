import { SignJWT } from "jose";

export const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "6bf6680598a374557023eabfc280e3e930bf080b"
);
export async function generateToken(payload: any, expiresIn: string) {
  let data = {
    _id: payload._id.toString(),
    name: payload.name,
    email: payload.email,
    mobileNumber: payload.mobileNumber,
    subscription: payload.subscription.toString(),
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
