import type { ProgressRecord } from "@/lib/types";

export async function POST(request: Request, { params }: { params: Promise<{ instruction: string }> }) {
  const { instruction } = await params;
  const body = await request.json().catch(() => ({ score: 0, weakAreas: [] }));
  const score = Number(body.score || 0);
  const progress: ProgressRecord = {
    instruction: instruction.toUpperCase(),
    completed: score >= 70,
    quizScore: score,
    attempts: 1,
    weakAreas: body.weakAreas ?? [],
    xp: Math.max(10, score * 2),
    streak: 1
  };

  return Response.json({ progress });
}
