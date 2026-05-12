import { Router } from "express";
import { supabase } from "../lib/supabase";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { buildCareerCoachPrompt } from "../services/promptBuilder";

const router = Router();

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

  const response = await fetch(
    "https://router.huggingface.co/novita/v3/openai/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        stream: true,
      }),
    }
  );

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "");
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) {
          fullReport += text;
          res.write(`data: ${text}\n\n`);
        }
      } catch {}
    }
  }

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await supabase.from("ai_reports").upsert({
    user_id: userId,
    report_content: fullReport,
    generated_at: new Date().toISOString(),
    expires_at: expiresAt,
  });

  res.write("data: [DONE]\n\n");
  res.end();
});

export default router;
