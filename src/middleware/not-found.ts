import type { Request, Response } from "express";

export default function handleNotFound(_: Request, res: Response) {
  res.status(404).json({ error: "Route not found" });
}
