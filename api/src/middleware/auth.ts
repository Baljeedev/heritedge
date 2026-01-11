import type { Request, Response, NextFunction } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

// Initialize Clerk client with secret key
const getClerkClient = () => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is not set in environment variables");
  }
  return clerkClient({ secretKey });
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.substring(7);

    // Verify the token with Clerk
    const clerk = getClerkClient();
    const session = await clerk.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Get user details from Clerk
    const user = await clerk.users.getUser(session.sub);
    
    req.userId = session.sub;
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const clerk = getClerkClient();
      const session = await clerk.verifyToken(token);

      if (session && session.sub) {
        const user = await clerk.users.getUser(session.sub);
        req.userId = session.sub;
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

