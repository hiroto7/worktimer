"use client";

import { TasksContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [text, setText] = useLocalStorage("tasks", "{}");

  if (text === undefined) return; 

  const tasks = new Map(Object.entries<string>(JSON.parse(text)));
  const setTasks = (tasks: ReadonlyMap<string, string>) =>
    setText(JSON.stringify(Object.fromEntries(tasks)));

  const add = (newTasks: readonly string[]) =>
    setTasks(
      new Map([
        ...tasks,
        ...newTasks.map((task) => [crypto.randomUUID(), task] as const),
      ])
    );

  const rename = (uuid: string, name: string) =>
    setTasks(new Map([...tasks, [uuid, name]]));

  const remove = (task: string) =>
    setTasks(new Map([...tasks].filter(([key]) => key !== task)));

  return (
    <TasksContext.Provider value={{ tasks, add, rename, remove }}>
      {children}
    </TasksContext.Provider>
  );
};
