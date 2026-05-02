import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useState } from "react";

type Repo = {
  name: string;
  description: string | null;
  primary_language: string;
  stars_count: number;
  last_pushed_at: string;
};

type RepoResponse = {
  repos: Repo[];
  total: number;
};

function Repositories() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["repos", page],
    queryFn: () => apiFetch<RepoResponse>(`/dashboard/repos?page=${page}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  return (
    <div>
      {data?.repos?.map((repo) => (
        <div key={repo.name}>
          <div>{repo.name}</div>
          <div>{repo.description}</div>
          <div>{repo.primary_language}</div>
          <div>{repo.stars_count}</div>
          <div>{repo.last_pushed_at}</div>
        </div>
      ))}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * 10 >= (data?.total ?? 0)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Repositories;
