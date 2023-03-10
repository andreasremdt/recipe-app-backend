import express from "express";

import * as session from "./controllers/session";
import * as recipe from "./controllers/recipe";
import * as user from "./controllers/user";
import userSchema from "./schemas/user";
import recipeSchema from "./schemas/recipe";
import profileUpdateSchema from "./schemas/profile-update";
import passwordResetSchema from "./schemas/password-reset";
import validate from "./middleware/validate";
import auth from "./middleware/auth";

export default express
  .Router()

  .get("/me", auth, user.get)
  .get("/user/exists", user.exists)
  .patch("/user/:id/profile", auth, validate(profileUpdateSchema), user.updateProfile)
  .patch("/user/:id/password", auth, validate(passwordResetSchema), user.updatePassword)
  .delete("/user/:id", auth, user.destroy)

  .post("/auth/sign-in", validate(userSchema), session.signIn)
  .post("/auth/sign-up", validate(userSchema), session.signUp)

  .get("/recipes", auth, recipe.getAll)
  .get("/recipes/:id", auth, recipe.get)
  .post("/recipes", auth, validate(recipeSchema), recipe.create)
  .patch("/recipes/:id", auth, validate(recipeSchema), recipe.update)
  .delete("/recipes/:id", auth, recipe.destroy);
