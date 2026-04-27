import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { syncUserGitHubData } from '../services/syncService'
import { supabase } from '../lib/supabase'