export type ProgressRecord = {
  instruction: string;
  completed: boolean;
  quizScore: number;
  attempts: number;
  xp: number;
};

export function summarizeProgress(records: ProgressRecord[]) {
  const total = records.length;
  const completed = records.filter((record) => record.completed).length;
  const xp = records.reduce((sum, record) => sum + record.xp, 0);
  const averageQuiz = total ? Math.round(records.reduce((sum, record) => sum + record.quizScore, 0) / total) : 0;

  return {
    total,
    completed,
    xp,
    averageQuiz,
    completionPercentage: total ? Math.round((completed / total) * 100) : 0
  };
}
