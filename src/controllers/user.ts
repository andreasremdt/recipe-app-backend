import type { NextFunction, Request, Response } from "express";

import prisma from "../database/client";
import { comparePasswords, hashPassword } from "../utils/auth";

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user?.id,
      },
    });

    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (ex) {
    next(ex);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.id !== req.params.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id, email, name } = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        email: req.body.email,
        name: req.body.name,
      },
    });

    res.json({ data: { id, email, name } });
  } catch (ex) {
    next(ex);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.id !== req.params.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await comparePasswords(req.body.oldPassword, user.password))) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { email, id, name } = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        password: await hashPassword(req.body.newPassword),
      },
    });

    res.json({ data: { email, id, name } });
  } catch (ex) {
    next(ex);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.id !== req.params.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { email, name, id } = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: { email, name, id } });
  } catch (ex) {
    next(ex);
  }
}
