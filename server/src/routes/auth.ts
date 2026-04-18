import { Router } from "express";
import { Octokit } from "@octokit/rest";
import { supabase } from "../lib/supabase";
import { signToken } from "../lib/jwt";
import { authMiddleware } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth"; 

const router = Router();

router.get("/github", (req, res) => {
  const { GITHUB_CLIENT_ID } = process.env;

  if (!GITHUB_CLIENT_ID) {
    throw new Error("Missing GITHUB_CLIENT_ID");
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: "http://localhost:3001/auth/callback",
    scope: "read:user repo",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get("/callback", async (req, res) => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const code = req.query.code as string;
  const response = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );
  const data = await response.json();
  console.log("data:", data);

  const octokit = new Octokit({ auth: data.access_token });
  const { data: githubUser } = await octokit.rest.users.getAuthenticated();
  console.log("githubUser:", githubUser);

  const { data: user, error } = await supabase
  .from("users")
  .upsert({
    github_id: String(githubUser.id),
    username: githubUser.login,
    display_name: githubUser.name,
    avatar_url: githubUser.avatar_url,
    github_access_token: data.access_token,
  }, { onConflict: "github_id" })
  .select()
  .single();

  const token = signToken(user!.id);
  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const { data: user, error } = await supabase
  .from('users')
  .select('id, github_id, username, display_name, avatar_url, created_at')  
  .eq('id', req.userId!)  
  .single();

  if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

res.json(user);
});

export default router;
