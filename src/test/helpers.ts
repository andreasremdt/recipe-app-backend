import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import request from "supertest";
import { vi } from "vitest";

import server from "../server";

export async function login(user: Pick<User, "password" | "email">) {
  const {
    body: { token },
  } = await request(server).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  return token;
}

export function getRequest({
  body,
  params,
  headers,
}: { body?: any; params?: any; headers?: any } = {}) {
  return {
    body: body || {},
    params: params || {},
    headers: headers || {},
  } as Request;
}

export function getResponse() {
  const res: Partial<Response> = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);

  return res as Response;
}

export function getNext() {
  return vi.fn() as unknown as NextFunction;
}
