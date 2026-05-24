"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Boxes, Filter, Flame, Layers3, Search, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiBase, cn } from "@/lib/utils";
import type { Difficulty, Instruction, ProgressRecord } from "@/lib/types";

const difficulties: Array<"All" | Difficulty> = ["All", "Beginner", "Medium", "Advanced"];

export function Dashboard() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [daily, setDaily] = useState<Instruction | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/api/instructions`).then((res) => res.json()),
      fetch(`${apiBase}/api/daily-challenge`).then((res) => res.json())
    ])
      .then(([data, challenge]) => {
        setInstructions(data.instructions);
        setProgress(data.progress);
        setDaily(challenge.instruction);
      })
      .catch(() => setInstructions([]));
  }, []);

  const merged = useMemo(
    () =>
      instructions.map((instruction) => {
        const record = progress.find((item) => item.instruction === instruction.name);
        return {
          ...instruction,
          progress: record?.completed ? 100 : instruction.progress,
          quizScore: record?.quizScore ?? instruction.quizScore,
          xp: record?.xp ?? 0
        };
      }),
    [instructions, progress]
  );

  const filtered = merged.filter((instruction) => {
    const text = `${instruction.name} ${instruction.shortDescription}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (difficulty === "All" || instruction.difficulty === difficulty);
  });

  const completed = merged.filter((instruction) => instruction.progress === 100).length;
  const xp = progress.reduce((sum, record) => sum + record.xp, 0);
  const averageQuiz = progress.length ? Math.round(progress.reduce((sum, record) => sum + record.quizScore, 0) / progress.length) : 0;
  const completion = merged.length ? Math.round((completed / merged.length) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6">
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
        <div className="grid min-h-[21rem] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground/75">
              <Boxes size={16} className="text-primary" aria-hidden="true" />
              Dockerfile training workspace
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-normal sm:text-6xl">
              Learn Dockerfile instructions with lessons, quizzes, and guided practice.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/68">
              Move from beginner explanations to production-style examples, then prove the idea with code reading and a small Dockerfile challenge.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <Summary icon={<BookOpen size={18} />} label="Lessons" value={String(merged.length || 18)} />
              <Summary icon={<Trophy size={18} />} label="Complete" value={`${completed}/${merged.length || 18}`} />
              <Summary icon={<Flame size={18} />} label="XP" value={String(xp)} />
              <Summary icon={<Layers3 size={18} />} label="Quiz Avg" value={`${averageQuiz}%`} />
            </div>
          </div>

          <aside className="border-t border-border bg-slate-950 p-6 text-white lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-300">Daily challenge</p>
                <h2 className="mt-3 text-5xl font-black">{daily?.name ?? "..."}</h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                  {daily?.shortDescription ?? "Preparing today's instruction challenge."}
                </p>
              </div>
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-300">
                  <span>Lab completion</span>
                  <span>{completion}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-sky-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                  />
                </div>
                {daily ? (
                  <Button asChild className="mt-6 w-full bg-white text-slate-950 hover:bg-slate-100">
                    <Link href={`/learn/${daily.slug}`}>
                      Start daily challenge <ArrowRight size={16} />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sticky top-[4.25rem] z-30 my-6 rounded-lg border border-border bg-card/95 p-3 shadow-soft backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative">
            <span className="sr-only">Search instructions</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm shadow-sm"
              placeholder="Search instructions, examples, or difficulty..."
            />
          </label>
          <div className="flex items-center gap-2 overflow-auto" aria-label="Difficulty filter">
            <Filter size={16} className="shrink-0 text-foreground/50" aria-hidden="true" />
            {difficulties.map((item) => (
              <button
                key={item}
                onClick={() => setDifficulty(item)}
                className={cn(
                  "h-10 rounded-md border px-3 text-sm font-semibold transition",
                  difficulty === item ? "border-primary bg-primary text-white" : "border-border bg-background hover:bg-muted"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <Button asChild variant="outline" className="justify-center">
            <Link href="/learn/copy">Compare COPY and ADD</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Dockerfile instructions">
        {filtered.map((instruction, index) => (
          <motion.article
            key={instruction.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.018 }}
          >
            <Card className="group relative h-full overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:border-primary/50">
              <div className={cn("h-1.5", stripeClass(instruction.difficulty))} />
              <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold uppercase text-primary">{instruction.difficulty}</p>
                    <h2 className="mt-2 text-3xl font-black tracking-normal">{instruction.name}</h2>
                  </div>
                  <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-4 min-h-12 text-sm leading-6 text-foreground/68">{instruction.shortDescription}</p>

                <div className="mt-5 rounded-md border border-border bg-background p-3">
                  <div className="mb-2 flex justify-between text-xs font-bold text-foreground/65">
                    <span>Lesson progress</span>
                    <span>{instruction.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${instruction.progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground/55">Quiz score</p>
                    <p className="text-lg font-black">{instruction.quizScore}%</p>
                  </div>
                  <Button asChild>
                    <Link href={`/learn/${instruction.slug}`}>
                      Learn <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.article>
        ))}
      </section>
    </main>
  );
}

function Summary({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-2 text-foreground/55">
        {icon}
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}

function stripeClass(difficulty: Difficulty) {
  if (difficulty === "Beginner") return "bg-emerald-500";
  if (difficulty === "Medium") return "bg-sky-500";
  return "bg-amber-500";
}
