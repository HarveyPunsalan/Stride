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

  // will be filled in across tickets 3.2 - 3.5
}
