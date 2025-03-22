import { cors } from "hono/cors";
import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables!");
}

export const corsTest = cors({
  origin: ["http://localhost:4200"],
});

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: Missing token" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set("user", decoded);
    await next();
  } catch (err) {
    console.error("Invalid Token:", (err as Error).message);
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};

export const authorize = (roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user || !roles.includes(user.role)) {
      return c.json({ message: "Forbidden: Insufficient permissions" }, 403);
    }
    await next();
  };
};
