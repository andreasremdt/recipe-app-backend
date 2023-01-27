import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import config from "../config";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization;

  try {
    if (!bearer) {
      throw new Error("Not authorized.");
    }

    const [, token] = bearer.split(" ");

    if (!token) {
      throw new Error("Not authorized.");
    }

    const { email, name, id } = jwt.verify(token, config.jwtSecret) as Pick<
      User,
      "id" | "email" | "name"
    >;

    req.user = { email, name, id };
    next();
  } catch (ex) {
    res.status(401).json({ message: (ex as Error).message });
  }
}
