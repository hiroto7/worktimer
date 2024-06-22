"use client";

import { TaskCards } from "@/components/TaskCards";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useState } from "react";

const RecentPage = () => {
  const { tasks: recentTasks } = useRecentTasks();
  const [initialRecentTasks] = useState(recentTasks);

  return (
    <main>
      <TaskCards tasks={initialRecentTasks} onOrderChange={undefined} />
    </main>
  );
};

export default RecentPage;
