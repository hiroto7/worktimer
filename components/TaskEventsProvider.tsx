"use client";

import { TaskEvent, analyzeTaskEventSequence } from "@/lib";
import { TaskEventsContext } from "@/lib/contexts";
import React, { useEffect, useState } from "react";

export const TaskEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<readonly TaskEvent[]>();

  useEffect(() => {
    const text = localStorage.getItem("events");
    if (text === null) setEvents([]);
    else {
      const events: TaskEvent[] = JSON.parse(text);
      setEvents(events);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  if (events === undefined) return undefined;

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
