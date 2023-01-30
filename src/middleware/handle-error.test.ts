import { expect, test } from "vitest";

import handleError from "./handle-error";
import { getNext, getRequest, getResponse } from "../test/helpers";

test("it responds with a 500 error code and message", () => {
  const req = getRequest();
  const res = getResponse();
  const next = getNext();
  const err = new Error("Testing Error");

  handleError(err, req, res, next);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: "Testing Error",
  });
});
