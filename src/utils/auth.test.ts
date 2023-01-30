import type { User } from "@prisma/client";
import { expect, test } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { hashPassword, comparePasswords, generateJWT } from "./auth";
import config from "../config";
import { users } from "../test/seed-database";

test("returns a hashed password", async () => {
  const hashed = await hashPassword("1234");

  expect(bcrypt.compareSync("1234", hashed)).toEqual(true);
});

test("compares two passwords", async () => {
  const hashed = bcrypt.hashSync("1234", config.bcryptRounds);

  expect(await comparePasswords("1234", hashed)).toEqual(true);
  expect(await comparePasswords("123", hashed)).toEqual(false);
});

test("returns a jwt token", async () => {
  const [user] = users;
  const token = generateJWT(user as User);

  expect(jwt.verify(token, config.jwtSecret)).toMatchObject(
    expect.objectContaining({ id: user.id, email: user.email, name: user.name })
  );
});
