"use client";

import { RecentTasksContext } from "@/lib/contexts";
import { useTasks } from "@/lib/hooks/use-tasks";
import React, { ReactNode, useEffect, useState } from "react";

export const RecentTasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { tasks: names } = useTasks();
  const [taskUUIDs, setTaskUUIDs] = useState<readonly string[]>();

  useEffect(() => {
    const text = localStorage.getItem("recent-tasks");
    if (text === null) setTaskUUIDs([]);
    else {
      const tasks: readonly string[] = JSON.parse(text);
      setTaskUUIDs(tasks);
    }
  }, []);

  useEffect(() => {
    if (taskUUIDs === undefined) return;
    localStorage.setItem("recent-tasks", JSON.stringify(taskUUIDs));
  }, [taskUUIDs]);

  if (taskUUIDs === undefined) return undefined;

  const tasks = taskUUIDs
    .filter((task) => names.has(task))
    .map((uuid) => ({ uuid, name: names.get(uuid)! }));

  const push = (task: string) =>
    setTaskUUIDs([...new Set([task, ...taskUUIDs])]);

  return (
    <RecentTasksContext.Provider value={{ tasks, push }}>
      {children}
    </RecentTasksContext.Provider>
  );
};
