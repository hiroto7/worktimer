"use client";

import { RecentTasksContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

const INITIAL_VALUE = [] as const;

export const RecentTasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useLocalStorage<readonly string[]>(
    "recent-tasks",
    INITIAL_VALUE,
    JSON
  );

  if (tasks === undefined) return;

  const push = (task: string) => setTasks([...new Set([task, ...tasks])]);

  return (
    <RecentTasksContext.Provider value={{ tasks, push }}>
      {children}
    </RecentTasksContext.Provider>
  );
};

