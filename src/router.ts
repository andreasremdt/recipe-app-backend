import express from "express";

import * as user from "./controllers/user";
import * as recipe from "./controllers/recipe";
import userSchema from "./schemas/user";
import validate from "./middleware/validate";
import auth from "./middleware/auth";

export default express
  .Router()
  .post("/auth/login", validate(userSchema), user.login)
  .post("/auth/signup", validate(userSchema), user.signup)
  .post("/auth/logout", user.logout)

  .get("/recipes", auth, recipe.getAll)
  .get("/recipes/:id", auth, recipe.get)
  .post("/recipes", auth, recipe.create)
  .patch("/recipes/:id", auth, recipe.update)
  .delete("/recipes/:id", auth, recipe.destroy);
