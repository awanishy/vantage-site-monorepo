import { Request } from "express";

// Extend the Express Request interface to include user authentication data
export interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
