import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";

import server from "../server";
import seed, { users, recipes } from "../test/seed-database";
import { login } from "../test/helpers";

beforeEach(async () => {
  await seed({ silent: true });
});

describe("GET /api/recipes", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).get("/api/recipes");

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("it only returns recipes that belong to the logged in user", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data.length).toEqual(2);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: recipes[0].title }),
        expect.objectContaining({ title: recipes[2].title }),
      ])
    );
  });

  test("it only returns not marked as trashed", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data.length).toEqual(2);
    expect(response.body.data).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ title: recipes[1].title })])
    );
  });
});

describe("GET /api/recipes/:id", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).get(`/api/recipes/${recipes[0].id}`);

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("a 404 is returned if the given id does not exist in the database", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .get("/api/recipes/not-existing")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("a 404 is returned if the recipe does not belong to the logged in user", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .get(`/api/recipes/${recipes[3]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("the recipe data is returned correctly", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .get(`/api/recipes/${recipes[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toMatchObject(expect.objectContaining(recipes[0]));
  });
});

describe("POST /api/recipes", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).post("/api/recipes").send();

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("invalid body parameters return a 422", async () => {
    const token = await login(users[0]);
    let response = await request(server)
      .post("/api/recipes")
      .send()
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "title" is required`,
    });

    response = await request(server)
      .post("/api/recipes")
      .send({
        title: "Testing Recipe #1",
        rating: "invalid",
        timeNeeded: true,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "rating" must be a number. "timeNeeded" must be a number`,
    });
  });

  test("a new recipe is created and returned", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .post("/api/recipes")
      .send({ title: "Testing Recipe #1" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toMatchObject(
      expect.objectContaining({
        title: "Testing Recipe #1",
        timeNeeded: null,
        userId: users[0].id,
      })
    );
  });
});

describe("PATCH /api/recipes/:id", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).patch(`/api/recipes/${recipes[0].id}`).send();

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("a 404 is returned if the given id does not exist in the database", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .patch("/api/recipes/not-existing")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("a 404 is returned if the recipe does not belong to the logged in user", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .patch(`/api/recipes/${recipes[3].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("invalid body parameters return a 422", async () => {
    const token = await login(users[0]);
    let response = await request(server)
      .patch(`/api/recipes/${recipes[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ trashed: "yes" });

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "title" is required. "trashed" must be a boolean`,
    });

    response = await request(server)
      .patch(`/api/recipes/${recipes[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: `Bad input. "title" is required`,
    });
  });

  test("an existing recipe is updated and returned", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .patch(`/api/recipes/${recipes[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", trashed: true });

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toMatchObject(
      expect.objectContaining({
        title: "Updated Title",
        trashed: true,
        userId: users[0].id,
      })
    );
  });
});

describe("DELETE /api/recipes/:id", () => {
  test("if no user is logged in, it returns a 401", async () => {
    const response = await request(server).delete(`/api/recipes/${recipes[0].id}`);

    expect(response.status).toEqual(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      message: "Not authorized.",
    });
  });

  test("a 404 is returned if the given id does not exist in the database", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .delete("/api/recipes/not-existing")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("a 404 is returned if the recipe does not belong to the logged in user", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .delete(`/api/recipes/${recipes[3].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject({
      error: "Not found",
    });
  });

  test("an existing recipe is deleted and returned", async () => {
    const token = await login(users[0]);
    const response = await request(server)
      .delete(`/api/recipes/${recipes[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.data).toMatchObject(
      expect.objectContaining({
        id: recipes[0].id,
      })
    );
  });
});
