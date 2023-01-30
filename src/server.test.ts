import { expect, test, beforeEach } from "vitest";
import request from "supertest";

import server from "./server";
import { login } from "./test/helpers";
import seed, { users } from "./test/seed-database";

beforeEach(async () => {
  await seed({ silent: true });
});

test("the `x-powered-by` header is not sent", async () => {
  const token = await login(users[0]);
  const response = await request(server)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  expect(response.headers["x-powered-by"]).not.toBeDefined();
});

test("unregistered routes are handled with a 404", async () => {
  const response = await request(server).get("/api/not-existing");

  expect(response.status).toEqual(404);
  expect(response.body).toMatchObject({ error: "Route not found" });
});
