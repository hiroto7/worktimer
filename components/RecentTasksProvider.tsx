"use client";

import { RecentTasksContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useTasks } from "@/lib/hooks/use-tasks";

const INITIAL_VALUE = [] as const;

export const RecentTasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tasks: names } = useTasks();
  const [taskUUIDs, setTaskUUIDs] = useLocalStorage<readonly string[]>(
    "recent-tasks",
    INITIAL_VALUE,
    JSON
  );

  if (taskUUIDs === undefined) return;

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
