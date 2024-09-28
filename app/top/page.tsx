"use client";

import { TaskCards } from "@/components/TaskCards";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useState } from "react";

const RecentPage = () => {
  const { elapsedTimes, ongoingTasks, lastEventTime } = useTaskEvents();

  const [tasks] = useState(
    [...elapsedTimes.entries()]
      .map(
        ([task, time]) =>
          [
            task,
            ongoingTasks.has(task) && lastEventTime !== undefined
              ? time + (Date.now() - lastEventTime) / ongoingTasks.size
              : time,
          ] as const
      )
      .sort(([, a], [, b]) => b - a)
      .map(([task]) => task)
  );

  return (
    <main>
      <TaskCards tasks={tasks} onOrderChange={undefined} />
    </main>
  );
};

export default RecentPage;
