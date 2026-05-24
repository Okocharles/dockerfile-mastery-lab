import { seedInstructions } from "@/data/seed";

export function GET() {
  const day = Math.floor(Date.now() / 86400000);
  const instruction = seedInstructions[day % seedInstructions.length];

  return Response.json({
    title: `Daily Challenge: ${instruction.name}`,
    prompt: `Explain ${instruction.name}, inspect its code sample, then score at least 75% on its quiz.`,
    instruction
  });
}
