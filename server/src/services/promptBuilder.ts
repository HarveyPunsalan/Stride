import { supabase } from "../lib/supabase";

export async function buildCareerCoachPrompt(userId: string): Promise<string> {
  const { data: languageStats } = await supabase
    .from("language_stats")
    .select("language, percentage")
    .eq("user_id", userId)
    .order("percentage", { ascending: false });

  const { data: prStats } = await supabase
    .from("pr_stats")
    .select("total_prs, merged_prs, merge_rate")
    .eq("user_id", userId)
    .single();

  const { data: commitStats } = await supabase
    .from("commit_stats")
    .select("date, commit_count")
    .eq("user_id", userId)
    .gte(
      "date",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    )
    .order("date", { ascending: false });

  const top3Languages = (languageStats ?? []).slice(0, 3);
  

  const totalCommits = (commitStats ?? []).reduce(
    (sum, row) => sum + row.commit_count,
    0,
  );
  const avgDailyCommits =
    commitStats && commitStats.length > 0
      ? (totalCommits / commitStats.length).toFixed(1)
      : "0";
}
