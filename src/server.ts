import express from "express";
import morgan from "morgan";
import cors from "cors";

import router from "./router";
import handleError from "./middleware/handle-error";

export default express()
  .disable("x-powered-by")
  .use(cors())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/api", router)
  .use(handleError);
