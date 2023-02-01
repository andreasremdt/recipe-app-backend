import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";

import server from "../server";
import seed, { users } from "../test/seed-database";
import { login } from "../test/helpers";

beforeEach(async () => {
  await seed({ silent: true });
});

describe("GET /api/me", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).get("/api/me");

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("it returns the correct user if logged in", async () => {
    const token = await login(users[0]);
    const response = await request(server).get("/api/me").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toMatchObject(
      expect.objectContaining({
        email: users[0].email,
        name: users[0].name,
      })
    );
  });
});

describe("GET /api/user/exists", () => {
  test("it returns a 200 if no email is provided", async () => {
    const response = await request(server).get("/api/user/exists");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({ available: true });
  });

  test("it checks the availability of an email address", async () => {
    let response = await request(server).get("/api/user/exists?email=doesntexist@example.org");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({ available: true });

    response = await request(server).get(`/api/user/exists?email=${users[0].email}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({ available: false });
  });
});
