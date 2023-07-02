"use client";

import { RecentTasksContext } from "@/lib/contexts";
import React, { ReactNode, useEffect, useState } from "react";

export const RecentTasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<ReadonlySet<string>>();

  useEffect(() => {
    const text = localStorage.getItem("recent-tasks");
    if (text === null) setTasks(new Set());
    else {
      const tasks: readonly string[] = JSON.parse(text);
      setTasks(new Set(tasks));
    }
  }, []);

  useEffect(() => {
    if (tasks === undefined) return;
    localStorage.setItem("recent-tasks", JSON.stringify([...tasks]));
  }, [tasks]);

  if (tasks === undefined) return undefined;

  const push = (task: string) => setTasks(new Set([task, ...tasks]));

  return (
    <RecentTasksContext.Provider value={{ tasks, push }}>
      {children}
    </RecentTasksContext.Provider>
  );
};
