import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = (req.headers["x-request-id"] as string) || uuidv4();
  (req as any).requestId = incoming;
  res.setHeader("x-request-id", incoming);
  next();
}


