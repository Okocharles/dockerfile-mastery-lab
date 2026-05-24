import { LearnClient } from "@/components/learn-client";

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LearnClient slug={slug} />;
}
