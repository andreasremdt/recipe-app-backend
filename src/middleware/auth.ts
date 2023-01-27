import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import prisma from "../database/client";

export default async function auth(req: Request, res: Response, next: NextFunction) {
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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("Not authorized.");
    }

    req.user = { email, name, id };
    next();
  } catch (ex) {
    res.status(401).json({ message: (ex as Error).message });
  }
}
