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

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  for (const row of commitStats ?? []) {
    if (row.commit_count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return `You are a senior software engineering career coach.

Analyze this developer's GitHub activity and provide a personalized growth report.

## Developer Stats
- Top languages: ${top3Languages.map((l) => `${l.language} (${l.percentage}%)`).join(", ")}
- Average daily commits (last 30 days): ${avgDailyCommits}
- Current commit streak: ${streak} days
- Total PRs: ${prStats?.total_prs ?? 0}
- Merged PRs: ${prStats?.merged_prs ?? 0}
- PR merge rate: ${prStats?.merge_rate ?? 0}%

## Task
1. Identify 2-3 skill gaps based on these stats
2. Give 3 specific recommendations to reach a senior level
3. Keep it concise and actionable`;
}
