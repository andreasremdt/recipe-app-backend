import type { Request, Response } from "express";

import prisma from "../database/client";
import { comparePasswords, hashPassword } from "../utils/auth";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    const exists = await prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new Error(`A user with the email ${email} already exists.`);
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        name,
      },
    });

    return res.status(201).json({ data: user });
  } catch (ex) {
    res.status(400).json({ error: (ex as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("Email or password are invalid.");
    }

    if (!(await comparePasswords(password, user.password))) {
      throw new Error("Email or password are invalid.");
    }

    res.json({ data: user });
  } catch (ex) {
    res.status(401).json({ error: (ex as Error).message });
  }
}

export function logout(req: Request, res: Response) {
  res.json({});
}
