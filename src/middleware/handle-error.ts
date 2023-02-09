import type { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function handleError(err: Error, _: Request, res: Response, next: NextFunction) {
  res.status(500).json({ error: err.message });
}
