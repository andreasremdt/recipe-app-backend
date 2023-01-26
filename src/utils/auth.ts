import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { User } from "@prisma/client";
import config from "../config";

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 16);
}

export function comparePasswords(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function generateJWT(user: User) {
  const { id, email, name } = user;

  return jwt.sign({ id, email, name }, config.jwtSecret);
}