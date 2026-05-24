import { describe, expect, it } from "vitest";
import { summarizeProgress } from "../lib/progress";

describe("summarizeProgress", () => {
  it("calculates completion, quiz average, and xp", () => {
    expect(
      summarizeProgress([
        { instruction: "COPY", completed: true, quizScore: 80, attempts: 1, xp: 120 },
        { instruction: "RUN", completed: false, quizScore: 40, attempts: 2, xp: 30 }
      ])
    ).toEqual({ total: 2, completed: 1, xp: 150, averageQuiz: 60, completionPercentage: 50 });
  });
});
