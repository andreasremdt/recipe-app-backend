import type { User, Recipe } from "@prisma/client";
import { hashSync } from "bcrypt";

import config from "../config";
import prisma from "../database/client";

export const users: Omit<User, "createdAt" | "updatedAt">[] = [
  {
    id: "d050735e-881e-4532-a15a-f7a5540d1f5e",
    email: "john.doe@example.org",
    password: "XBy2tJLF",
    name: "John Doe",
  },
  {
    id: "ff77edbc-05e1-4797-8217-4870226b8595",
    email: "jane.doe@example.org",
    password: "tv9sJbRn",
    name: "Jane Doe",
  },
  {
    id: "d68b8c20-b305-4880-8c38-2951f3bd0809",
    email: "jannet.doe@example.org",
    password: "gz6bAnBu",
    name: null,
  },
];

export const recipes: Omit<Recipe, "createdAt" | "updatedAt">[] = [
  {
    title: "Sticky Oatmeal",
    description:
      "Inspired by Thai sticky rice, this sticky oatmeal will be your new go-to breakfast. Easy, simple, and delicious!",
    userId: "d050735e-881e-4532-a15a-f7a5540d1f5e",
    id: "e018694b-48a2-429d-aa34-becf7234e332",
    difficulty: "Beginner",
    ingredients: null,
    instructions: null,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    trashed: false,
    rating: 1,
    timeNeeded: 120,
  },
  {
    title: "Weekday Meal-Prep Pesto Chicken & Veggies",
    description: null,
    userId: "d050735e-881e-4532-a15a-f7a5540d1f5e",
    id: "eaf1148b-724e-4e0b-896f-1ec012f90d95",
    difficulty: "Expert",
    ingredients: null,
    instructions: null,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1673081849734-98f0969d436b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    trashed: true,
    rating: 4,
    timeNeeded: 35,
  },
  {
    title: "Chicken & Biscuits Bake",
    description: null,
    userId: "d050735e-881e-4532-a15a-f7a5540d1f5e",
    id: "3b32e5de-e7e5-4c29-b2bf-15cdbe6fbfab",
    difficulty: "Beginner",
    ingredients: null,
    instructions: null,
    thumbnailUrl: "http://placeholder.it",
    trashed: false,
    rating: 3,
    timeNeeded: 40,
  },
  {
    title: "Taco Soup",
    description:
      "This quick and easy taco soup is made entirely in one pot and in less than 30 minutes. Topped with cheese, avocado, and all the fixin's, this simple soup makes the perfect weeknight dinner that'll please just about everyone.",
    userId: "ff77edbc-05e1-4797-8217-4870226b8595",
    id: "339919e2-b23f-4df2-b153-11a33095b623",
    difficulty: "Intermediate",
    ingredients: null,
    instructions: null,
    thumbnailUrl: null,
    trashed: false,
    rating: 1,
    timeNeeded: 110,
  },
  {
    title: "One-Pot Lemon Garlic Shrimp Pasta",
    description: null,
    userId: "ff77edbc-05e1-4797-8217-4870226b8595",
    id: "c3780050-ed17-4a7b-88c5-7bcca9794365",
    difficulty: "Intermediate",
    ingredients: null,
    instructions: null,
    thumbnailUrl:
      "https://plus.unsplash.com/premium_photo-1669130744959-53fdf266d621?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    trashed: true,
    rating: 3,
    timeNeeded: 30,
  },
];

export default async function seed({ silent = false }: { silent: boolean }) {
  function log(message: string) {
    if (!silent) {
      console.info(message);
    }
  }

  try {
    log("Cleaning database...");
    await prisma.user.deleteMany({});
    await prisma.recipe.deleteMany({});

    log("Starting to seed database...");
    await prisma.user.createMany({
      data: users.map((user) => ({
        ...user,
        password: hashSync(user.password, config.bcryptRounds),
      })),
    });
    await prisma.recipe.createMany({
      data: recipes,
    });

    log("🌱 Database has been seeded.");
  } catch (ex) {
    console.error("Database seeding failed", (ex as Error).message);
  }
}
