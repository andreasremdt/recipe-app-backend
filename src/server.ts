import express from "express";
import morgan from "morgan";
import cors from "cors";

import router from "./router";

export default express()
  .disable("x-powered-by")
  .use(cors())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/api", router);
