import { defaultProgress } from "@/lib/progress-store";

export function GET() {
  return Response.json({ progress: defaultProgress() });
}
