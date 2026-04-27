import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { syncUserGitHubData } from '../services/syncService'
import { supabase } from '../lib/supabase'

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
    const { data: user } = await supabase
    .from("users")
    .select("last_synced_at")
    .eq("id", req.userId)
    .single()

    if (user?.last_synced_at) {
        const lastSync = new Date(user.last_synced_at).getTime()
        const oneHourAgo = Date.now() - 60 * 60 * 1000
        if (lastSync > oneHourAgo) {
            res.status(429).json({ error: "Synced too recently" })
            return
        }
    }

    await syncUserGitHubData(req.userId!)
    res.json({ success: true })
});

export default router;