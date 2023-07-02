"use client";

import { TaskCards } from "@/components/TaskCards";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Box, Container } from "@mui/material";
import { useState } from "react";

const RecentPage = () => {
  const { tasks } = useTasks();
  const { tasks: recentTasks } = useRecentTasks();
  const [initialRecentTasks] = useState(recentTasks);

  return (
    <Container component="main">
      <Box sx={{ my: 2 }}>
        <TaskCards
          tasks={
            new Map(
              [...initialRecentTasks]
                .filter((task) => tasks.has(task))
                .map((task) => [task, tasks.get(task)!])
            )
          }
        />
      </Box>
    </Container>
  );
};

export default RecentPage;
