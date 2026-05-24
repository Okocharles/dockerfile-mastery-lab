"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  FileCode2,
  Lightbulb,
  ListTree,
  Play,
  RotateCw,
  Route,
  Shuffle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiBase, cn } from "@/lib/utils";
import type { ExplanationMode, Instruction } from "@/lib/types";

const modes: { id: ExplanationMode; label: string; helper: string }[] = [
  { id: "technical", label: "Technical", helper: "Precise Docker vocabulary" },
  { id: "industry", label: "Industry", helper: "How teams discuss it" },
  { id: "layman", label: "Layman", helper: "Plain beginner language" }
];

export function LearnClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [commands, setCommands] = useState<Instruction[]>([]);
  const [mode, setMode] = useState<ExplanationMode>("technical");
  const [copied, setCopied] = useState(false);
  const [openCode, setOpenCode] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/api/instructions/${slug}`).then((res) => res.json()),
      fetch(`${apiBase}/api/instructions`).then((res) => res.json())
    ]).then(([lesson, all]) => {
      setInstruction(lesson.instruction);
      setCommands(all.instructions ?? []);
      setCopied(false);
    });
  }, [slug]);

  if (!instruction) {
    return <main className="mx-auto max-w-6xl px-4 py-10">Loading lesson...</main>;
  }

  const commandList = commands.length ? commands : [instruction];
  const currentIndex = Math.max(0, commandList.findIndex((item) => item.slug === instruction.slug));
  const previous = commandList[(currentIndex - 1 + commandList.length) % commandList.length];
  const next = commandList[(currentIndex + 1) % commandList.length];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6">
      <section className="mb-4 rounded-lg border border-border bg-card p-3 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/">
              <ArrowLeft size={16} /> Dashboard
            </Link>
          </Button>

          <div className="grid gap-2 sm:grid-cols-[auto_minmax(14rem,22rem)_auto] sm:items-center">
            <Button asChild variant="outline" className="justify-center">
              <Link href={`/learn/${previous.slug}`}>
                <ArrowLeft size={16} /> {previous.name}
              </Link>
            </Button>
            <label className="relative">
              <span className="sr-only">Select a command to study</span>
              <ListTree className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" size={17} aria-hidden="true" />
              <select
                value={instruction.slug}
                onChange={(event) => router.push(`/learn/${event.target.value}`)}
                className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm font-semibold"
                aria-label="Select a command to study"
              >
                {commandList.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    Study {item.name}
                  </option>
                ))}
              </select>
            </label>
            <Button asChild className="justify-center">
              <Link href={`/learn/${next.slug}`}>
                Next: {next.name} <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="font-mono text-xs font-black uppercase tracking-normal text-primary">Dockerfile instruction</p>
            <h1 className="mt-3 text-5xl font-black leading-none tracking-normal sm:text-7xl">{instruction.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-foreground/68">{instruction.shortDescription}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Metric label="Difficulty" value={instruction.difficulty} />
              <Metric label="Questions" value={String(instruction.quiz.length)} />
              <Metric label="Examples" value={String(instruction.scenarios.length)} />
            </div>
          </div>

          <div className="bg-background/50 p-5 sm:p-6 lg:p-8">
            <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Explanation mode">
              {modes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  role="tab"
                  aria-selected={mode === item.id}
                  className={cn(
                    "rounded-lg border p-4 text-left transition",
                    mode === item.id ? "border-primary bg-primary text-white shadow-soft" : "border-border bg-card hover:bg-muted"
                  )}
                >
                  <span className="block text-sm font-black">{item.label}</span>
                  <span className={cn("mt-1 block text-xs", mode === item.id ? "text-white/80" : "text-foreground/55")}>{item.helper}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <p className="text-lg leading-8">{instruction.explanations[mode]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="space-y-6">
          <VisualLearning name={instruction.name} />
          <UseCases instruction={instruction} />
          <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
            <button
              className="flex w-full items-center justify-between gap-3 p-5 text-left"
              onClick={() => setOpenCode((value) => !value)}
              aria-expanded={openCode}
            >
              <span className="flex items-center gap-3 text-2xl font-black">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sky-300">
                  <Code2 size={20} aria-hidden="true" />
                </span>
                Code View
              </span>
              <ChevronDown className={cn("transition-transform", openCode && "rotate-180")} aria-hidden="true" />
            </button>
            {openCode ? (
              <div className="border-t border-border p-5">
                <div className="mb-3 flex justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground/60">Working Dockerfile example</p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(instruction.code);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1200);
                    }}
                  >
                    {copied ? <Check size={16} /> : <Clipboard size={16} />} {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="code-scroll overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100 shadow-inner">
                  <code>{instruction.code}</code>
                </pre>
              </div>
            ) : null}
          </section>
          <PracticePlayground />
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <QuizPanel instruction={instruction} />
          <Flashcards instruction={instruction} />
          <ComparePanel active={instruction.name} />
          <AiTutor instruction={instruction.name} />
        </aside>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-bold uppercase text-foreground/50">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function VisualLearning({ name }: { name: string }) {
  const label = visualLabel(name);
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase text-primary">Animated model</p>
          <h2 className="mt-1 text-2xl font-black">What {name} changes</h2>
        </div>
        <Sparkles className="text-primary" aria-hidden="true" />
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <motion.div
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
          >
            <FileCode2 className="mb-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-bold text-foreground/55">Before</p>
            <p className="mt-1 text-2xl font-black">{label.left}</p>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
          >
            <div className="h-1 w-24 rounded-full bg-primary md:w-28" />
          </motion.div>
          <motion.div
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
          >
            <Route className="mb-4 text-accent" aria-hidden="true" />
            <p className="text-sm font-bold text-foreground/55">After</p>
            <p className="mt-1 text-2xl font-black">{label.right}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function UseCases({ instruction }: { instruction: Instruction }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
          <Lightbulb size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-xs font-bold uppercase text-primary">Real work</p>
          <h2 className="text-2xl font-black">Use cases and mini stories</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {instruction.scenarios.map((scenario, index) => (
          <article key={scenario.title} className="grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[3rem_1fr]">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-card font-mono text-sm font-black shadow-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-black">{scenario.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/68">{scenario.story}</p>
              <p className="mt-2 text-sm font-bold">{scenario.companyUsage}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuizPanel({ instruction }: { instruction: Instruction }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; percent: number; weakAreas: string[] } | null>(null);

  const submit = async () => {
    const weakAreas: string[] = [];
    let score = 0;
    instruction.quiz.forEach((question) => {
      if ((answers[question.id] ?? "").trim().toLowerCase() === question.answer.toLowerCase()) score += 1;
      else weakAreas.push(question.weakArea);
    });
    const percent = Math.round((score / instruction.quiz.length) * 100);
    setResult({ score, percent, weakAreas: Array.from(new Set(weakAreas)) });
    await fetch(`${apiBase}/api/quiz/${instruction.name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: percent, weakAreas })
    });
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Quiz</h2>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">{instruction.quiz.length} prompts</span>
      </div>
      <div className="mt-4 space-y-4">
        {instruction.quiz.map((question) => (
          <div key={question.id} className="rounded-lg border border-border bg-background p-3">
            <label className="text-sm font-bold leading-6">{question.prompt}</label>
            {question.options ? (
              <select
                value={answers[question.id] ?? ""}
                onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
                className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
              >
                <option value="">Choose an answer</option>
                {question.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                value={answers[question.id] ?? ""}
                onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
                className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                placeholder="Type the instruction"
              />
            )}
          </div>
        ))}
      </div>
      <Button className="mt-5 w-full" onClick={submit}>
        <Play size={16} /> Submit quiz
      </Button>
      {result ? (
        <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm">
          <p className="text-lg font-black">Score: {result.percent}%</p>
          <p className="mt-1 leading-6 text-foreground/68">Weak areas: {result.weakAreas.join(", ") || "none"}</p>
        </div>
      ) : null}
    </Card>
  );
}

function Flashcards({ instruction }: { instruction: Instruction }) {
  const cards = useMemo(
    () => [
      { front: instruction.name, back: instruction.explanations.layman },
      { front: `${instruction.name} syntax`, back: instruction.code.split("\n")[1] ?? instruction.code.split("\n")[0] },
      { front: `${instruction.name} advanced`, back: instruction.explanations.technical }
    ],
    [instruction]
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Flashcards</h2>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next flashcard"
          onClick={() => {
            setIndex((index + 1) % cards.length);
            setFlipped(false);
          }}
        >
          <Shuffle size={16} />
        </Button>
      </div>
      <button
        className="mt-4 min-h-40 w-full rounded-lg border border-border bg-slate-950 p-5 text-left text-white shadow-inner"
        onClick={() => setFlipped(!flipped)}
        aria-label="Flip flashcard"
      >
        <p className="text-xs font-bold uppercase text-sky-300">{flipped ? "Answer" : "Prompt"}</p>
        <p className="mt-3 text-lg font-bold leading-7">{flipped ? cards[index].back : cards[index].front}</p>
      </button>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-semibold">
        {["Beginner", "Advanced", "Mixed"].map((mode) => (
          <span key={mode} className="rounded-md border border-border bg-background px-2 py-2 text-center">
            {mode}
          </span>
        ))}
      </div>
    </Card>
  );
}

function PracticePlayground() {
  const bank = ["FROM node:20-alpine", "WORKDIR /app", "COPY . .", "RUN npm ci", "EXPOSE 3000", "CMD [\"npm\", \"start\"]"];
  const [lines, setLines] = useState<string[]>(["COPY . .", "FROM node:20-alpine", "CMD [\"npm\", \"start\"]"]);
  const issues = validateNode(lines);

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs font-bold uppercase text-primary">Practice</p>
          <h2 className="text-2xl font-black">Build a Node.js Dockerfile</h2>
        </div>
        <Button variant="outline" onClick={() => setLines(["FROM node:20-alpine", "WORKDIR /app"])}>
          <RotateCw size={16} /> Reset
        </Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="mb-3 text-sm font-bold text-foreground/65">Instruction bank</p>
          <div className="grid gap-2">
            {bank.map((line) => (
              <Button key={line} variant="outline" className="justify-start font-mono text-xs" onClick={() => setLines((current) => (current.includes(line) ? current : [...current, line]))}>
                {line}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <textarea
            value={lines.join("\n")}
            onChange={(event) => setLines(event.target.value.split("\n"))}
            className="min-h-56 w-full rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100 shadow-inner"
            aria-label="Dockerfile playground editor"
          />
          <div className="mt-3 rounded-lg border border-border bg-background p-4 text-sm">
            {issues.length === 0 ? <p className="font-black text-emerald-600">Looks valid for this challenge.</p> : issues.map((issue) => <p key={issue} className="mb-1 leading-6">{issue}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparePanel({ active }: { active: string }) {
  const pairs =
    active === "ADD" || active === "COPY"
      ? ["COPY keeps file movement explicit.", "ADD can fetch or unpack, so teams use it carefully."]
      : ["CMD supplies defaults that can be replaced.", "ENTRYPOINT defines the main executable more firmly."];

  return (
    <Card className="p-5">
      <h2 className="text-2xl font-black">Compare</h2>
      <div className="mt-4 grid gap-3">
        {pairs.map((text, index) => (
          <div key={text} className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-bold uppercase text-primary">{index === 0 ? "Option A" : "Option B"}</p>
            <p className="mt-1 text-sm leading-6 text-foreground/70">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AiTutor({ instruction }: { instruction: string }) {
  const [message, setMessage] = useState("");
  const reply = message
    ? `Hint for ${instruction}: look at what the instruction changes, then place it near the Dockerfile step where that change should happen.`
    : "Ask for a hint after trying the quiz or playground.";

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Bot className="text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-black">AI Tutor</h2>
      </div>
      <div className="mt-4 rounded-lg border border-border bg-background p-4 text-sm leading-6">{reply}</div>
      <label className="mt-3 block">
        <span className="sr-only">Ask AI tutor</span>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          placeholder="Ask why an answer is wrong"
        />
      </label>
    </Card>
  );
}

function visualLabel(name: string) {
  const map: Record<string, { left: string; right: string }> = {
    COPY: { left: "project files", right: "/app folder" },
    ADD: { left: "archive or URL", right: "added content" },
    EXPOSE: { left: "application", right: "documented port" },
    VOLUME: { left: "data folder", right: "persistent path" },
    WORKDIR: { left: "root folder", right: "working folder" },
    FROM: { left: "base choice", right: "new image" },
    RUN: { left: "setup command", right: "image layer" }
  };
  return map[name] ?? { left: "instruction", right: "result" };
}

function validateNode(lines: string[]) {
  const order = ["FROM", "WORKDIR", "COPY", "RUN", "EXPOSE", "CMD"];
  const instructions = lines.map((line) => line.trim().split(/\s+/)[0]?.toUpperCase()).filter(Boolean);
  const issues: string[] = [];
  if (instructions[0] !== "FROM") issues.push("Start with FROM so the build has a base.");
  order.forEach((item) => {
    if (!instructions.includes(item)) issues.push(`${item} is missing.`);
  });
  order.forEach((item, index) => {
    if (index === 0) return;
    const previous = instructions.indexOf(order[index - 1]);
    const current = instructions.indexOf(item);
    if (previous >= 0 && current >= 0 && current < previous) issues.push(`${item} should come after ${order[index - 1]}.`);
  });
  return issues;
}
