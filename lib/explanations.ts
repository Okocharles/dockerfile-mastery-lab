export type ExplanationMode = "technical" | "industry" | "layman";

export function getExplanation<T extends Record<ExplanationMode, string>>(item: T, mode: ExplanationMode) {
  return item[mode];
}
