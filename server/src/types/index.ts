export interface User {
  id: string;
  github_id: string; 
  username: string; 
  display_name: string | null;
  avatar_url: string | null;
  github_access_token: string | null;
  is_profile_public: boolean;
  show_repositories: boolean;
  last_synced_at: string | null;
  created_at: string | null;
}


export interface Repository {
  id: string;
  user_id: string;
  github_repo_id: string;
  name: string;
  description: string | null;
  primary_language: string | null;
  stars_count: number;
  is_private: boolean;
  last_pushed_at: string | null;
  html_url: string | null;
  updated_at: string;
}

export interface LanguageStat {
  id: string
  user_id: string;
  language: string;
  percentage: number;
  bytes: number;
  synced_at: string;
}

export interface CommitStat {
  id: string
  user_id: string;
  date: string;
  commit_count: number;
}

export interface PrStat {
  id: string
  user_id: string;
  total_prs: number;
  merged_prs: number;
  closed_prs: number;
  merge_rate: number;
  synced_at: string;
}

export interface AiReport {
  id: string
  user_id: string;
  report_content: string;
  generated_at: string
  expires_at: string
}