import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import dbConnect from "./db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
}

export async function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    } as AuthUser;
  } catch (error) {
    console.error("Auth helper error:", error);
    return null;
  }
}

export function getUserIdFromRequest(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}
