import { expect, test } from "vitest";

import handleNotFound from "./not-found";
import { getRequest, getResponse } from "../test/helpers";

test("it responds with a 404 error code and message", () => {
  const req = getRequest();
  const res = getResponse();

  handleNotFound(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "Route not found",
  });
});
