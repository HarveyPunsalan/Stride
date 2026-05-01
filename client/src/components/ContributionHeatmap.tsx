interface CommitStat {
  date: string;
  commit_count: number;
}

interface HeatmapProps {
  commitStats: CommitStat[];
}

export default function ContributionHeatmap({ commitStats }: HeatmapProps) {
  const today = new Date();
  const days = Array.from({ length: 364 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (363 - i));
    return date.toISOString().slice(0, 10);
  });

  const commitMap = Object.fromEntries(
    commitStats.map((row) => [row.date, row.commit_count]),
  );

  function commitColorClass(commitCount: number) {
    if (commitCount === 0) {
      return `bg-gray-200`;
    } else if (commitCount >= 1 && commitCount <= 2) {
      return `bg-green-200`;
    } else if (commitCount >= 3 && commitCount <= 5) {
      return "bg-green-400"; // Medium
    } else if (commitCount >= 6 && commitCount <= 9) {
      return "bg-green-600"; // Dark
    } else {
      return "bg-green-800"; // Darkest 
    }
  }

  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1 bg-gray-900 p-4">
      {days.map((date) => {
        const count = commitMap[date] ?? 0;
        return (
          <div
            key={date}
            className={`w-3 h-3 rounded-sm ${commitColorClass(count)}`}
            title={`${date}: ${count} commits`}
          />
        );
      })}
    </div>
  );
}
