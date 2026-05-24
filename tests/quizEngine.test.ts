import { describe, expect, it } from "vitest";
import { gradeQuiz } from "../lib/quizEngine";

describe("gradeQuiz", () => {
  it("scores answers and reports weak areas", () => {
    const result = gradeQuiz(
      [
        { id: "q1", type: "multiple-choice", prompt: "Default command?", answer: "CMD", weakArea: "startup" },
        { id: "q2", type: "fill-blank", prompt: "Base image?", answer: "FROM", weakArea: "base image" }
      ],
      { q1: " cmd ", q2: "RUN" }
    );

    expect(result).toEqual({ score: 1, total: 2, percent: 50, weakAreas: ["base image"] });
  });
});
