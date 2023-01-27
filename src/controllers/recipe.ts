import type { NextFunction, Request, Response } from "express";

import prisma from "../database/client";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    res.json({ data: recipes });
  } catch (ex) {
    next(ex);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: req.params.id,
        userId: req.user?.id,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ data: recipe });
  } catch (ex) {
    next(ex);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      title,
      description,
      thumbnailUrl,
      ingredients,
      instructions,
      rating,
      difficulty,
      timeNeeded,
    } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        thumbnailUrl,
        ingredients,
        instructions,
        rating,
        difficulty,
        timeNeeded,
        user: {
          connect: {
            id: req.user?.id,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(201).json({ data: recipe });
  } catch (ex) {
    next(ex);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      title,
      description,
      thumbnailUrl,
      ingredients,
      instructions,
      rating,
      difficulty,
      timeNeeded,
      trashed,
    } = req.body;

    const exists = await prisma.recipe.findUnique({
      where: {
        id_userId: {
          id: req.params.id,
          userId: req.user?.id!,
        },
      },
    });

    if (!exists) {
      return res.status(404).json({ error: "Not found" });
    }

    const recipe = await prisma.recipe.update({
      where: {
        id_userId: {
          id: req.params.id,
          userId: req.user?.id!,
        },
      },
      data: {
        title,
        description,
        thumbnailUrl,
        ingredients,
        instructions,
        rating,
        difficulty,
        timeNeeded,
        trashed,
      },
    });

    res.json({ data: recipe });
  } catch (ex) {
    next(ex);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const exists = await prisma.recipe.findUnique({
      where: {
        id_userId: {
          id: req.params.id,
          userId: req.user?.id!,
        },
      },
    });

    if (!exists) {
      return res.status(404).json({ error: "Not found" });
    }

    const recipe = await prisma.recipe.delete({
      where: {
        id_userId: {
          id: req.params.id,
          userId: req.user?.id!,
        },
      },
    });

    res.json({ data: recipe });
  } catch (ex) {
    next(ex);
  }
}
