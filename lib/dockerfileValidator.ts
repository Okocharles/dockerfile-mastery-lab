export type ValidationIssue = {
  line?: number;
  message: string;
  hint: string;
};

const nodeOrder = ["FROM", "WORKDIR", "COPY", "RUN", "EXPOSE", "CMD"];

export function validateNodeDockerfile(lines: string[]): ValidationIssue[] {
  const normalized = lines.map((line) => line.trim()).filter(Boolean);
  const instructions = normalized.map((line) => line.split(/\s+/)[0]?.toUpperCase());
  const issues: ValidationIssue[] = [];

  if (instructions[0] !== "FROM") {
    issues.push({ line: 1, message: "Start with FROM.", hint: "Choose the base image before adding app files." });
  }

  for (const required of nodeOrder) {
    if (!instructions.includes(required)) {
      issues.push({ message: `${required} is missing.`, hint: `A Node.js app Dockerfile usually needs ${required}.` });
    }
  }

  const positions = nodeOrder.map((instruction) => instructions.indexOf(instruction));
  for (let index = 1; index < positions.length; index += 1) {
    if (positions[index] !== -1 && positions[index - 1] !== -1 && positions[index] < positions[index - 1]) {
      issues.push({
        message: `${nodeOrder[index]} appears too early.`,
        hint: `Place ${nodeOrder[index]} after ${nodeOrder[index - 1]} for this challenge.`
      });
    }
  }

  return issues;
}
