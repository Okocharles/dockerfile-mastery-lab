import type { ProgressRecord } from "@/lib/types";
import { seedInstructions } from "@/data/seed";

export function defaultProgress(): ProgressRecord[] {
  return seedInstructions.map((instruction) => ({
    instruction: instruction.name,
    completed: false,
    quizScore: 0,
    attempts: 0,
    weakAreas: [],
    xp: 0,
    streak: 0
  }));
}
