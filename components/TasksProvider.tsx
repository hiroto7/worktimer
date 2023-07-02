"use client";

import { TasksContext } from "@/lib/contexts";
import React, { useEffect, useState } from "react";

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<ReadonlyMap<string, string>>();

  useEffect(() => {
    const text = localStorage.getItem("tasks");
    if (text === null) setTasks(new Map());
    else {
      const tasks = new Map(Object.entries<string>(JSON.parse(text)));
      setTasks(tasks);
    }
  }, []);

  useEffect(() => {
    if (tasks === undefined) return;
    localStorage.setItem("tasks", JSON.stringify(Object.fromEntries(tasks)));
  }, [tasks]);

  if (tasks === undefined) return undefined;

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
