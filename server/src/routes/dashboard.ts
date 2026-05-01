import { Router } from "express";
import { supabase } from "../lib/supabase";
import { authMiddleware } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/stats", authMiddleware, async (req: AuthRequest, res) => {
  const { data: commitStats } = await supabase
    .from("commit_stats")
    .select("*")
    .eq("user_id", req.userId);

  const { data: languageStats } = await supabase
    .from("language_stats")
    .select("*")
    .eq("user_id", req.userId);

  const { data: prStats } = await supabase
    .from("pr_stats")
    .select("*")
    .eq("user_id", req.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { count: repoCount } = await supabase
    .from("repositories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", req.userId);

  commitStats?.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  let streak = 0;

  for (const row of commitStats ?? []) {
    if (row.commit_count > 0) {
      streak++;
    } else {
      break;
    }
  }

  res.json({ streak, commitStats, prStats, languageStats, repoCount });
});

router.get("/repos", authMiddleware, async (req: AuthRequest, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: repos, count } = await supabase
    .from("repositories")
    .select("*", { count: "exact" })
    .eq("user_id", req.userId)
    .order("last_pushed_at", { ascending: false })
    .range(from, to);

  res.json({ repos, total: count });
});

export default router;
