import { SignJWT } from "jose";

export const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "6bf6680598a374557023eabfc280e3e930bf080b"
);
export async function generateToken(payload: any, expiresIn = "15m") {
  let data = {
    _id: payload._id,
    name: payload.name,
    email: payload.email,
    mobileNumber: payload.mobileNumber,
    subscriptionId: payload.subscriptionId,
    username: payload.username,
    role: payload.role,
    isActive: payload.isActive,
    credits: Number(payload.credits ?? 0),
  };
  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" }) // Algorithm for HMAC
    .setExpirationTime(expiresIn) // Expiration time
    .sign(SECRET_KEY);
}
