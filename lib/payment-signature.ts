import crypto from "crypto";

/**
 * Server-only helpers for the hosted-payment handshake with Sajjan Mart.
 *
 * Sajjan Mart owns the Razorpay account and creates/collects the payment.
 * Both apps share PAYMENT_SHARED_SECRET so the request and the result can be
 * signed end-to-end. Only the signed tokens travel through the browser —
 * neither the Razorpay key secret nor the shared secret is ever exposed.
 */

export type SignedRequest = { p: string; sign: string };

export interface CrossPaymentRequest {
  source: "cricvista";
  ref: string;
  amount: number;
  currency: "INR";
  description: string;
  customer: { name: string; email: string; phone: string };
  returnUrl: string;
  issuedAt: number;
}

export interface CrossPaymentResult {
  ref: string;
  status: "success" | "failed";
  amount: number;
  currency: "INR";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  reason?: string;
  completedAt: number;
}

function paymentSecret(): string {
  const secret = process.env.PAYMENT_SHARED_SECRET;
  if (!secret) throw new Error("PAYMENT_SHARED_SECRET not configured");
  return secret;
}

/** HMAC SHA256 over the base64url payload string, hex encoded. */
function signPayloadString(payload: string): string {
  return crypto.createHmac("sha256", paymentSecret()).update(payload).digest("hex");
}

/** Encode an object as `p` (base64url JSON) plus its signature. */
export function encodeSignedPayload(payload: unknown): SignedRequest {
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { p, sign: signPayloadString(p) };
}

/** Verify an opaque `p.sign` token and return the decoded object, or null. */
export function decodeSignedToken<T>(token: string): T | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;
  const p = token.slice(0, separator);
  const sign = token.slice(separator + 1);
  const expected = signPayloadString(p);
  if (expected.length !== sign.length) return null;
  if (
    !crypto.timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(sign, "utf8"),
    )
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(p, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

/** Reject stale tokens so a captured result cannot be replayed forever. */
export function isFresh(completedAt: number, maxAgeMs = 15 * 60 * 1000): boolean {
  if (!Number.isFinite(completedAt)) return false;
  const age = Date.now() - completedAt;
  return age >= -2 * 60 * 1000 && age <= maxAgeMs;
}
