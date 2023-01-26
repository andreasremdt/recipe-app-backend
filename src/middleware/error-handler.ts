import type { NextFunction, Request, Response } from "express";

export default function handleError(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).json({ error: err.message });
}
