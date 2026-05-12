import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "../lib/supabase";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { buildCareerCoachPrompt } from "../services/promptBuilder";

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.get("/report", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const now = new Date().toISOString();

  const { data: cachedReport } = await supabase
    .from("ai_reports")
    .select("report_content")
    .eq("user_id", userId)
    .gt("expires_at", now)
    .single();

  if (cachedReport) {
    res.json({ report: cachedReport.report_content });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const prompt = await buildCareerCoachPrompt(userId);
  let fullReport = "";

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  stream.on("text", (text) => {
    fullReport += text;
    res.write(`data: ${text}\n\n`);
  });
});
