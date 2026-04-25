import { bytes } from "node:stream/consumers";
import { supabase } from "../lib/supabase";
import { Octokit } from "@octokit/rest";

export async function syncUserGitHubData(userId: string): Promise<void> {
  const { data: user, error } = await supabase
    .from("users")
    .select("github_access_token")
    .eq("id", userId)
    .single();

  if (error || !user) throw new Error(`User not found: ${userId}`);

  const octokit = new Octokit({ auth: user.github_access_token });

  const repos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
    },
  );

  await supabase.from("repositories").upsert(
    repos.map((repo) => ({
      user_id: userId,
      github_repo_id: String(repo.id),
      name: repo.name,
      description: repo.description ?? null,
      primary_language: repo.language ?? null,
      stars_count: repo.stargazers_count ?? 0,
      is_private: repo.private,
      last_pushed_at: repo.pushed_at ?? null,
      html_url: repo.html_url ?? null,
    })),
    { onConflict: "github_repo_id" },
  );

  const languageTotals: Record<string, number> = {};
  for (const repo of repos) {
    const { data: languages } = await octokit.rest.repos.listLanguages({
      owner: repo.owner.login,
      repo: repo.name,
    });

    for (const [language, bytes] of Object.entries(languages)) {
      languageTotals[language] = (languageTotals[language] ?? 0) + bytes;
    }
  }

  const totalBytes = Object.values(languageTotals).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );
  const languageStats = Object.entries(languageTotals).map(
    ([language, bytes]) => ({
      user_id: userId,
      language,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      synced_at: new Date().toISOString(),
    }),
  );

  await supabase.from('language_stats').delete().eq('user_id', userId)
  await supabase.from('language_stats').insert(languageStats)
  // will be filled in across tickets 3.2 - 3.5
}
