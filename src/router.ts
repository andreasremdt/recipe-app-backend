import express from "express";

export default express
  .Router()
  .post("/auth/login", () => {})
  .post("/auth/signup", () => {})
  .post("/auth/logout", () => {})

  .get("/recipes", () => {})
  .get("/recipes/:id", () => {})
  .post("/recipes", () => {})
  .patch("/recipes/:id", () => {})
  .delete("/recipes/:id", () => {});
