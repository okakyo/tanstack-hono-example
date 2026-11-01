import { describe, expect, it } from "vitest";
import * as target from "./find-members.usecase";

describe("find-members.usecase", () => {
  it("exports are defined", () => {
    expect(target).toBeDefined();
  });
});
