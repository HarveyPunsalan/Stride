import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../lib/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { buildCareerCoachPrompt } from '../services/promptBuilder';