import { seedInstructions } from "@/data/seed";
import { defaultProgress } from "@/lib/progress-store";

export function GET() {
  return Response.json({ instructions: seedInstructions, progress: defaultProgress() });
}
