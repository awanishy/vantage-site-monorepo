import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@/users/user.model";

// Extend Express Request interface globally
declare global {
  namespace Express {
    interface Request {
      user: { userId: string; email: string; role: string };
    }
  }
}

export const authorize = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearer = req.headers.authorization;
      const token = bearer?.startsWith("Bearer ")
        ? bearer.slice(7)
        : (req as any).cookies?.token;

      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      // Verify user exists in database
      const user = await User.findById(decoded.userId).lean();
      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role || "USER",
      };
      next();
    } catch {
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  };
};

// Admin auth middleware
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
};

// Super admin auth middleware
export const superAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.user?.role;
  if (!userRole || userRole !== "SUPER_ADMIN") {
    res
      .status(403)
      .json({ success: false, message: "Super admin access required" });
    return;
  }
  next();
};
