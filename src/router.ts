import express from "express";

import * as user from "./controllers/user";
import * as recipe from "./controllers/recipe";
import userSchema from "./schemas/user";
import validate from "./middleware/validate";

export default express
  .Router()
  .post("/auth/login", user.login)
  .post("/auth/signup", validate(userSchema), user.signup)
  .post("/auth/logout", user.logout)

  .get("/recipes", recipe.getAll)
  .get("/recipes/:id", recipe.get)
  .post("/recipes", recipe.create)
  .patch("/recipes/:id", recipe.update)
  .delete("/recipes/:id", recipe.destroy);
