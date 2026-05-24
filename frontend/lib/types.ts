export type ExplanationMode = "technical" | "industry" | "layman";
export type Difficulty = "Beginner" | "Medium" | "Advanced";

export type Scenario = {
  title: string;
  story: string;
  companyUsage: string;
};

export type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "fill-blank" | "scenario" | "code";
  prompt: string;
  options?: string[];
  answer: string;
  weakArea: string;
};

export type Instruction = {
  slug: string;
  name: string;
  shortDescription: string;
  difficulty: Difficulty;
  progress: number;
  quizScore: number;
  explanations: Record<ExplanationMode, string>;
  scenarios: Scenario[];
  code: string;
  quiz: QuizQuestion[];
};

export type ProgressRecord = {
  instruction: string;
  completed: boolean;
  quizScore: number;
  attempts: number;
  weakAreas: string[];
  xp: number;
  streak: number;
};
