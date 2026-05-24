import cors from "cors";
import express from "express";
import { getInstruction, getInstructions, getProgress, initializeDatabase, saveQuizAttempt } from "./db.js";

initializeDatabase();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dockerfile-mastery-lab-api" });
});

app.get("/api/instructions", (_req, res) => {
  res.json({ instructions: getInstructions(), progress: getProgress() });
});

app.get("/api/instructions/random", (_req, res) => {
  const instructions = getInstructions();
  const pick = instructions[Math.floor(Math.random() * instructions.length)];
  res.json({ instruction: pick });
});

app.get("/api/instructions/:slug", (req, res) => {
  const instruction = getInstruction(req.params.slug);
  if (!instruction) {
    res.status(404).json({ error: "Instruction not found" });
    return;
  }
  res.json({ instruction, progress: getProgress().find((record) => record.instruction === instruction.name) });
});

app.get("/api/progress", (_req, res) => {
  res.json({ progress: getProgress() });
});

app.post("/api/quiz/:instruction", (req, res) => {
  const { score, weakAreas = [] } = req.body;
  const progress = saveQuizAttempt(req.params.instruction.toUpperCase(), Number(score || 0), weakAreas);
  res.json({ progress });
});

app.get("/api/daily-challenge", (_req, res) => {
  const day = Math.floor(Date.now() / 86400000);
  const instructions = getInstructions();
  const instruction = instructions[day % instructions.length];
  res.json({
    title: `Daily Challenge: ${instruction.name}`,
    prompt: `Explain ${instruction.name}, inspect its code sample, then score at least 75% on its quiz.`,
    instruction
  });
});

app.listen(port, () => {
  console.log(`Dockerfile Mastery Lab API running on ${port}`);
});
