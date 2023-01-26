import type { NextFunction, Request, Response } from "express";
import type { Schema } from "joi";

export default function validate(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (result.error) {
      return res.status(422).json({
        error: `Bad input. ${result.error.message}`,
      });
    }

    next();
  };
}
