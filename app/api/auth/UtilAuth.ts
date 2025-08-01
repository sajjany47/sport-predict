import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/types/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "6bf6680598a374557023eabfc280e3e930bf080b";
const JWT_EXPIRES_IN = "7d";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
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
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function generateResetToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Mock user database (replace with your actual database)
const users: User[] = [];
const resetTokens = new Map<string, { email: string; expires: Date }>();

export const userService = {
  async findByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) || null;
  },

  async findById(id: string): Promise<User | null> {
    return users.find((user) => user.id === id) || null;
  },

  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substring(2, 15),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return user;
  },

  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex === -1) return false;

    users[userIndex].password = await hashPassword(newPassword);
    users[userIndex].updatedAt = new Date();
    return true;
  },
};

export const resetTokenService = {
  create(email: string): string {
    const token = generateResetToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    resetTokens.set(token, { email, expires });
    return token;
  },

  verify(token: string): string | null {
    const tokenData = resetTokens.get(token);
    if (!tokenData || tokenData.expires < new Date()) {
      resetTokens.delete(token);
      return null;
    }
    return tokenData.email;
  },

  delete(token: string): void {
    resetTokens.delete(token);
  },
};
