"use client";

import { TaskEvent, analyzeTaskEventSequence } from "@/lib";
import { TaskEventsContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

const INITIAL_VALUE = [] as const;

export const TaskEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useLocalStorage<readonly TaskEvent[]>(
    "events",
    INITIAL_VALUE,
    JSON
  );

  if (events === undefined) return;

  const { elapsedTimes, ongoingTasks, lastEventTime } =
    analyzeTaskEventSequence(events);

  const resume = (task: string) =>
    setEvents([
      ...events,
      {
        task,
        time: Date.now(),
        type: "resume",
      },
    ]);

  const pause = (task: string) =>
    setEvents([
      ...events,
      {
        task,
        time: Date.now(),
        type: "pause",
      },
    ]);

  const focus = (task: string) =>
    setEvents([
      ...events,
      ...[...ongoingTasks]
        .filter((ongoing) => ongoing !== task)
        .map((task) => ({
          task,
          time: Date.now(),
          type: "pause" as const,
        })),
      ...(ongoingTasks.has(task)
        ? []
        : [
            {
              task,
              time: Date.now(),
              type: "resume" as const,
            },
          ]),
    ]);

  const pauseAll = () =>
    setEvents([
      ...events,
      ...[...ongoingTasks].map((task) => ({
        task,
        time: Date.now(),
        type: "pause" as const,
      })),
    ]);

  const clear = () => setEvents([]);

  const transfer = (time: number, from: string, to: string) =>
    setEvents([
      ...events,
      { from, to, value: time, type: "transfer", time: Date.now() },
    ]);

  return (
    <TaskEventsContext.Provider
      value={{
        events,
        elapsedTimes,
        ongoingTasks,
        lastEventTime,
        resume,
        pause,
        focus,
        pauseAll,
        clear,
        transfer,
      }}
    >
      {children}
    </TaskEventsContext.Provider>
  );
};
