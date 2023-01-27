import type { Request, Response } from "express";

import prisma from "../database/client";
import { comparePasswords, hashPassword, generateJWT } from "../utils/auth";

export async function signup(req: Request, res: Response) {
  try {
    const exists = await prisma.user.findFirst({
      where: { email: req.body.password },
    });

    if (exists) {
      throw new Error(`A user with the email ${req.body.email} already exists.`);
    }

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        name: req.body.name,
      },
    });

    return res.status(201).json({ token: generateJWT(user) });
  } catch (ex) {
    res.status(400).json({ error: (ex as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!user) {
      throw new Error("Email or password are invalid.");
    }

    if (!(await comparePasswords(req.body.password, user.password))) {
      throw new Error("Email or password are invalid.");
    }

    res.json({ token: generateJWT(user) });
  } catch (ex) {
    res.status(401).json({ error: (ex as Error).message });
  }
}
