import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import ContributionHeatmap from "../components/ContributionHeatmap";

interface PublicProfile {
  username: string;
  display_name: string;
  avatar_url: string;
  language_stats: {
    id: string;
    language: string;
    percentage: number;
    bytes: number;
  }[];
  pr_stats: {
    total_prs: number;
    merged_prs: number;
    closed_prs: number;
    merge_rate: number;
  }[];
  commit_stats: {
    date: string;
    commit_count: number;
  }[];
  repositories: null | {
    id: string;
    name: string;
  }[];
}

function PublicProfile() {
  const { username } = useParams();

  const { data, isLoading, isError } = useQuery<PublicProfile>({
    queryKey: ["profile", username],
    queryFn: () => apiFetch(`/profile/${username}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Profile not found or private.</div>;
  if (!data) return null;

  return (
    <div>
      <img src={data.avatar_url} alt={data.username} width={80} />
      <h1>{data.display_name}</h1>
      <p>@{data.username}</p>

      <h2>Languages</h2>
      {data.language_stats.map((lang) => (
        <div key={lang.id}>
          <span>{lang.language}</span>
          <span>{lang.percentage.toFixed(1)}%</span>
        </div>
      ))}

      <h2>Pull Requests</h2>
      <div>
        <span>Total PRs: {data.pr_stats[0]?.total_prs}</span>
        <span>Merged: {data.pr_stats[0]?.merged_prs}</span>
        <span>Closed: {data.pr_stats[0]?.closed_prs}</span>
        <span>Merge Rate: {data.pr_stats[0]?.merge_rate?.toFixed(1)}%</span>
      </div>

      <h2>Contributions</h2>
      <ContributionHeatmap commitStats={data.commit_stats} />
    </div>
  );
}

export default PublicProfile;
