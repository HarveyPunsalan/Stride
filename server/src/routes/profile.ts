import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.is_profile_public) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const { data: language_stats } = await supabase
    .from("language_stats")
    .select("*")
    .eq("user_id", user.id);

  const { data: commit_stats } = await supabase
    .from("commit_stats")
    .select("*")
    .eq("user_id", user.id);

  const { data: pr_stats } = await supabase
    .from("pr_stats")
    .select("*")
    .eq("user_id", user.id);

  let repositories = null;

  if (user.show_repositories) {
    const { data: repos } = await supabase
      .from("repositories")
      .select("*")
      .eq("user_id", user.id);

    repositories = repos;
  }

  return res.status(200).json({
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    language_stats,
    commit_stats,
    pr_stats,
    repositories,
  });
});

export default router;
