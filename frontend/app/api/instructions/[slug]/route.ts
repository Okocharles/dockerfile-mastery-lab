import { seedInstructions } from "@/data/seed";
import { defaultProgress } from "@/lib/progress-store";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const instruction = seedInstructions.find((item) => item.slug === slug);

  if (!instruction) {
    return Response.json({ error: "Instruction not found" }, { status: 404 });
  }

  return Response.json({
    instruction,
    progress: defaultProgress().find((item) => item.instruction === instruction.name)
  });
}
