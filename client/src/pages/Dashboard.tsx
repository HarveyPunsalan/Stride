import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";

type DashboardStats = {
  streak: number;
  commitStats: { date: string; commit_count: number }[];
  prStats: { merge_rate: number };
  repoCount: number;
  languageStats: { language: string; percentage: number }[];
};

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiFetch<DashboardStats>("/dashboard/stats"),
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const commitThisMonth = data?.commitStats
    ?.filter((row) => row.date.startsWith(currentMonth))
    ?.reduce((sum, row) => sum + row.commit_count, 0);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{(error as Error).message}</div>;

  return (
    <div>
      <div>{data?.streak}</div>
      <div>{data?.prStats?.merge_rate}</div>
      <div>{data?.repoCount}</div>
      <div>{commitThisMonth}</div>

      <BarChart width={600} height={300} data={data?.languageStats}>
        <XAxis dataKey="language" />
        <YAxis />
        <Bar dataKey="percentage">
          <LabelList dataKey="percentage" position="right" />
        </Bar>
      </BarChart>
    </div>  
  );
}

export default Dashboard;
