import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

export default express()
  .use(cors())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .disable("x-powered-by")
  .get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });
