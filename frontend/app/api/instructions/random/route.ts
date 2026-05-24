import { seedInstructions } from "@/data/seed";

export function GET() {
  const instruction = seedInstructions[Math.floor(Math.random() * seedInstructions.length)];
  return Response.json({ instruction });
}
