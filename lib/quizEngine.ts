export type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "fill-blank" | "scenario" | "code";
  prompt: string;
  answer: string;
  options?: string[];
  weakArea: string;
};

export type QuizResult = {
  score: number;
  total: number;
  percent: number;
  weakAreas: string[];
};

export function gradeQuiz(questions: QuizQuestion[], answers: Record<string, string>): QuizResult {
  let score = 0;
  const weakAreas = new Set<string>();

  for (const question of questions) {
    const expected = normalize(question.answer);
    const actual = normalize(answers[question.id] ?? "");
    if (expected === actual) {
      score += 1;
    } else {
      weakAreas.add(question.weakArea);
    }
  }

  return {
    score,
    total: questions.length,
    percent: questions.length ? Math.round((score / questions.length) * 100) : 0,
    weakAreas: Array.from(weakAreas)
  };
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
