import express from "express";
import morgan from "morgan";
import cors from "cors";

import router from "./router";
import handleError from "./middleware/handle-error";
import handleNotFound from "./middleware/not-found";

export default express()
  .disable("x-powered-by")
  .use(cors())
  .use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/api", router)
  .get("*", handleNotFound)
  .use(handleError);
