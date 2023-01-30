import { expect, test } from "vitest";

import auth from "./auth";
import { getNext, getRequest, getResponse } from "../test/helpers";
import { users } from "../test/seed-database";
import { generateJWT } from "../utils/auth";
import { User } from "@prisma/client";

test("it responds with a 401 if no bearer token is provided", () => {
  const req = getRequest();
  const res = getResponse();
  const next = getNext();

  auth(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Not authorized.",
  });
});

test("it responds with a 401 if the bearer token is empty", () => {
  const req = getRequest({
    headers: {
      authorization: "invalid-data",
    },
  });
  const res = getResponse();
  const next = getNext();

  auth(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Not authorized.",
  });
});

test("it responds with a 401 if the bearer token is invalid", () => {
  const req = getRequest({
    headers: {
      authorization: "Bearer invalid-data",
    },
  });
  const res = getResponse();
  const next = getNext();

  auth(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "jwt malformed",
  });
});

test.skip("it responds with a 401 if the user does not exist", () => {
  const token = generateJWT({
    id: "8ed322bb-8a9c-4107-9b13-037daa5be7f3",
    email: "test@example.org",
    name: "Testing",
  } as User);
  const req = getRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const res = getResponse();
  const next = getNext();

  auth(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({
    message: "Not authorized.",
  });
});

test.skip("it calls the `next` function", async () => {
  const token = generateJWT(users[0] as User);
  const req = getRequest({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const res = getResponse();
  const next = getNext();

  auth(req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalled();
});
