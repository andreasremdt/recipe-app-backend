import { expect, test } from "vitest";

import config from "./config";

test("all config properties are returned", () => {
  expect(config.port).toBeDefined();
  expect(config.port).toBeTypeOf("number");

  expect(config.jwtSecret).toBeDefined();
  expect(config.jwtSecret).toBeTypeOf("string");

  expect(config.bcryptRounds).toBeDefined();
  expect(config.bcryptRounds).toBeTypeOf("number");
});
