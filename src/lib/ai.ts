import { api } from "./api";

/* -------- Notes AI -------- */
export async function summarizeNotes(text: string) {
  const res = await api.post("/api/ai/notes/summarize", {
    text,
  });
  return res.data;
}

/* -------- Code AI -------- */
export async function explainCode(code: string, language: string) {
  const res = await api.post("/api/ai/code/explain", {
    code,
    language,
  });
  return res.data;
}

/* -------- Roadmap AI -------- */
export async function generateRoadmap(goal: string) {
  const res = await api.post("/api/ai/roadmap/generate", {
    goal,
  });
  return res.data;
}
