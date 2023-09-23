import type { TaskEvent } from "@/lib";
import { createContext } from "react";

export const TasksContext = createContext<{
  readonly tasks: ReadonlyMap<string, string>;
  add: (tasks: readonly string[]) => void;
  rename: (uuid: string, name: string) => void;
  remove: (task: string) => void;
} | null>(null);

export const TaskEventsContext = createContext<{
  events: readonly TaskEvent[];
  elapsedTimes: ReadonlyMap<string, number>;
  ongoingTasks: ReadonlySet<string>;
  lastEventTime: number | undefined;
  resume: (task: string) => void;
  pause: (task: string) => void;
  focus: (task: string) => void;
  increase: (task: string, time: number) => void;
  decrease: (task: string, time: number) => void;
  transfer: (time: number, from: string, to: string) => void;
  pauseAll: () => void;
  clear: () => void;
} | null>(null);

export const RecentTasksContext = createContext<{
  readonly tasks: readonly string[];
  push: (task: string) => void;
} | null>(null);
