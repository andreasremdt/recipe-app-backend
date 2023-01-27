import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";

import server from "../server";
import seed, { users } from "../test/seed-database";

beforeEach(async () => {
  await seed({ silent: true });
});

describe("POST /api/auth/signup", () => {
  test("invalid `email` or `password` parameters return a 422", async () => {
    let response = await request(server).post("/api/auth/signup");

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "email" is required. "password" is required`,
    });

    response = await request(server).post("/api/auth/login").send({ email: "", password: "" });

    expect(response.status).toEqual(422);
    expect(response.body).toMatchObject({
      error: `Bad input. "email" is not allowed to be empty. "password" is not allowed to be empty`,
    });

    response = await request(server)
      .post("/api/auth/login")
      .send({ email: users[0].email, password: "short" });

    expect(response.status).toEqual(422);
    expect(response.body).toMatchObject({
      error: `Bad input. "password" length must be at least 8 characters long`,
    });
  });

  test("a user can't sign up twice with the same email", async () => {
    const response = await request(server)
      .post("/api/auth/signup")
      .send({ email: users[0].email, password: users[0].password });

    expect(response.status).toEqual(400);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "A user with the email john.doe@example.org already exists.",
    });
  });

  test("a new user is created and the token returned", async () => {
    const response = await request(server)
      .post("/api/auth/signup")
      .send({ email: "test@example.org", password: "password" });

    expect(response.status).toEqual(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      token: expect.stringContaining("ey"),
    });
  });
});

describe("POST /api/auth/login", () => {
  test("invalid `email` or `password` parameters return a 422", async () => {
    let response = await request(server).post("/api/auth/login");

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "email" is required. "password" is required`,
    });

    response = await request(server).post("/api/auth/login").send({ email: "" });

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "email" is not allowed to be empty. "password" is required`,
    });

    response = await request(server)
      .post("/api/auth/login")
      .send({ email: users[0].email, password: "short" });

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "password" length must be at least 8 characters long`,
    });
  });

  test("an invalid password returns a 401", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: users[0].email,
      password: "invalid-password",
    });

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Email or password are invalid.`,
    });
  });

  test("an invalid email returns a 401", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: users[1].email,
      password: users[0].password,
    });

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Email or password are invalid.`,
    });
  });

  test("a token is returned if email and password are correct", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      token: expect.stringContaining("ey"),
    });
  });
});
