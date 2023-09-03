"use client";

import { TaskEvent, analyzeTaskEventSequence } from "@/lib";
import { TaskEventsContext } from "@/lib/contexts";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export const TaskEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [text, setText] = useLocalStorage("events", "[]");

  if (text === undefined) return;

  const events: readonly TaskEvent[] = JSON.parse(text);
  const setEvents = (events: readonly TaskEvent[]) =>
    setText(JSON.stringify(events));

  const { elapsedTimes, ongoingTasks } = analyzeTaskEventSequence(events);
  const lastEventTime = events.at(-1)?.time;

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

  return (
    <TaskEventsContext.Provider
      value={{
        elapsedTimes,
        ongoingTasks,
        lastEventTime,
        resume,
        pause,
        focus,
        pauseAll,
        clear,
      }}
    >
      {children}
    </TaskEventsContext.Provider>
  );
};
