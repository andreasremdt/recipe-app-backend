import express from "express";

import * as user from "./controllers/user";
import * as recipe from "./controllers/recipe";

export default express
  .Router()
  .post("/auth/login", user.login)
  .post("/auth/signup", user.signup)
  .post("/auth/logout", user.logout)

  .get("/recipes", recipe.getAll)
  .get("/recipes/:id", recipe.get)
  .post("/recipes", recipe.create)
  .patch("/recipes/:id", recipe.update)
  .delete("/recipes/:id", recipe.destroy);
