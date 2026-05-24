import { describe, expect, it } from "vitest";
import { getExplanation } from "../lib/explanations";

describe("getExplanation", () => {
  it("returns the selected explanation mode", () => {
    const item = { technical: "technical copy", industry: "team copy", layman: "plain copy" };
    expect(getExplanation(item, "layman")).toBe("plain copy");
  });
});
