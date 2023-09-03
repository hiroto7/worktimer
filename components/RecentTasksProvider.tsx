"use client";

import { RecentTasksContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useTasks } from "@/lib/hooks/use-tasks";

export const RecentTasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tasks: names } = useTasks();
  const [text, setText] = useLocalStorage("recent-tasks", "[]");

  if (text === undefined) return;

  const taskUUIDs: readonly string[] = JSON.parse(text);
  const setTaskUUIDs = (taskUUIDs: readonly string[]) =>
    setText(JSON.stringify(taskUUIDs));

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
