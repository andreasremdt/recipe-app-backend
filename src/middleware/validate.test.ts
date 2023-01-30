import { expect, test } from "vitest";
import joi from "joi";

import validate from "./validate";
import { getNext, getRequest, getResponse } from "../test/helpers";

const testSchema = joi.object({
  value1: joi.string().required(),
  value2: joi.number(),
});
const middleware = validate(testSchema);

test("missing properties are rejected with a 422", () => {
  const req = getRequest();
  const res = getResponse();
  const next = getNext();

  middleware(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(422);
  expect(res.json).toHaveBeenCalledWith({
    error: `Bad input. "value1" is required`,
  });
});

test("unknown properties are rejected with a 422", () => {
  const req = getRequest({ body: { value1: "testing", hacking: true } });
  const res = getResponse();
  const next = getNext();

  middleware(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(422);
  expect(res.json).toHaveBeenCalledWith({
    error: `Bad input. "hacking" is not allowed`,
  });
});

test("multiple errors are collected and return a 422", () => {
  const req = getRequest({ body: { value1: "", value2: "invalid" } });
  const res = getResponse();
  const next = getNext();

  middleware(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(422);
  expect(res.json).toHaveBeenCalledWith({
    error: `Bad input. "value1" is not allowed to be empty. "value2" must be a number`,
  });
});

test("valid body data is passed through", () => {
  const req = getRequest({ body: { value1: "testing" } });
  const res = getResponse();
  const next = getNext();

  middleware(req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalled();
});
