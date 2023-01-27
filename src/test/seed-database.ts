import { User } from "@prisma/client";
import { hashSync } from "bcrypt";

import prisma from "../database/client";

export const users: Pick<User, "email" | "password" | "name">[] = [
  {
    email: "john.doe@example.org",
    password: "XBy2tJLF",
    name: "John Doe",
  },
  {
    email: "jane.doe@example.org",
    password: "tv9sJbRn",
    name: "Jane Doe",
  },
  {
    email: "jannet.doe@example.org",
    password: "gz6bAnBu",
    name: null,
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

    log("Starting to seed database...");
    await prisma.user.createMany({
      data: users.map((user) => ({
        ...user,
        password: hashSync(user.password, 5),
      })),
    });

    log("🌱 Database has been seeded.");
  } catch (ex) {
    console.error("Database seeding failed", (ex as Error).message);
    process.exit(1);
  }
}
