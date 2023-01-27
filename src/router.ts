import express from "express";

import * as session from "./controllers/session";
import * as recipe from "./controllers/recipe";
import userSchema from "./schemas/user";
import recipeSchema from "./schemas/recipe";
import validate from "./middleware/validate";
import auth from "./middleware/auth";

export default express
  .Router()

  .get("/me", () => {})
  .patch("/user/:id", () => {})
  .delete("/user/:id", () => {})

  .post("/auth/login", validate(userSchema), session.login)
  .post("/auth/signup", validate(userSchema), session.signup)
  .post("/auth/logout", session.logout)

  .get("/recipes", auth, recipe.getAll)
  .get("/recipes/:id", auth, recipe.get)
  .post("/recipes", auth, validate(recipeSchema), recipe.create)
  .patch("/recipes/:id", auth, validate(recipeSchema), recipe.update)
  .delete("/recipes/:id", auth, recipe.destroy);
