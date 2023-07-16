"use client";

import { TaskCards } from "@/components/TaskCards";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { Container } from "@mui/material";
import { useState } from "react";

const RecentPage = () => {
  const { tasks: recentTasks } = useRecentTasks();
  const [initialRecentTasks] = useState(recentTasks);

  return (
    <Container component="main" sx={{ my: 2 }}>
      <TaskCards tasks={initialRecentTasks} onOrderChange={undefined} />
    </Container>
  );
};

export default RecentPage;
