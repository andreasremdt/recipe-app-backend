import type { Request, Response } from "express";

export default function handleError(err: Error, _: Request, res: Response) {
  res.status(500).json({ error: err.message });
}
