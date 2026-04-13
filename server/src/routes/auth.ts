import { Router } from "express";

const router = Router();

router.get("/github", (req, res) => {
    const { GITHUB_CLIENT_ID } = process.env;

    if (!GITHUB_CLIENT_ID) {
        throw new Error("Missing GITHUB_CLIENT_ID");
    }

    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: "http://localhost:3001/auth/callback",
        scope: "read:user repo"
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

export default router;