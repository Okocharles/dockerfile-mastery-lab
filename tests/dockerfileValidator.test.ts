import { describe, expect, it } from "vitest";
import { validateNodeDockerfile } from "../lib/dockerfileValidator";

describe("validateNodeDockerfile", () => {
  it("accepts a simple Node.js Dockerfile order", () => {
    expect(validateNodeDockerfile(["FROM node:20", "WORKDIR /app", "COPY . .", "RUN npm ci", "EXPOSE 3000", "CMD npm start"])).toEqual([]);
  });

  it("explains missing and misplaced instructions", () => {
    const issues = validateNodeDockerfile(["COPY . .", "FROM node:20", "CMD npm start"]);
    expect(issues.some((issue) => issue.message === "Start with FROM.")).toBe(true);
    expect(issues.some((issue) => issue.message === "WORKDIR is missing.")).toBe(true);
  });
});
