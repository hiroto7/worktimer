"use client";

import { TasksContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

const parse = (text: string) =>
  new Map(Object.entries<string>(JSON.parse(text) as Record<string, string>));

const stringify = (tasks: ReadonlyMap<string, string>) =>
  JSON.stringify(Object.fromEntries(tasks));

const INITIAL_VALUE: ReadonlyMap<string, string> = new Map();

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useLocalStorage("tasks", INITIAL_VALUE, {
    parse,
    stringify,
  });

  if (tasks === undefined) return;

  const add = (newTasks: readonly string[]) =>
    setTasks(
      new Map([
        ...tasks,
        ...newTasks.map((task) => [crypto.randomUUID(), task] as const),
      ]),
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
