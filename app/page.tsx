"use client";

import { TaskEvent, calculateTaskTimes, formatTime } from "@/lib";
import { useDate } from "@/lib/hooks/use-date";
import { useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<readonly TaskEvent[]>([]);
  const [tasks, setTasks] = useState<ReadonlySet<string>>(new Set());
  const [taskCombinations, setTaskCombinations] = useState<
    ReadonlyMap<string, readonly string[]>
  >(new Map());
  const date = useDate();

  const times = calculateTaskTimes(events, date.valueOf());
  const totalTime = [...times.values()].reduce(
    (previous, current) => previous + current,
    0
  );

  const ongoingTasks = [...tasks].filter(
    (task) => events.findLast((event) => event.task === task)?.type === "resume"
  );

  return (
    <main>
      <h1>worktimer</h1>
      <p>Total time: {formatTime(totalTime)}</p>
      <h2>Tasks</h2>
      <ul>
        {[...tasks].map((task) => (
          <li key={task}>
            <input
              type="checkbox"
              checked={ongoingTasks.includes(task)}
              onChange={(event) => {
                setEvents([
                  ...events,
                  {
                    task,
                    time: date.valueOf(),
                    type: event.target.checked ? "resume" : "pause",
                  },
                ]);
              }}
            />{" "}
            <input
              type="button"
              value="Solo"
              onClick={() =>
                setEvents([
                  ...events,
                  ...ongoingTasks
                    .filter((ongoing) => ongoing !== task)
                    .map((task) => ({
                      task,
                      time: date.valueOf(),
                      type: "pause" as const,
                    })),
                  ...(ongoingTasks.includes(task)
                    ? []
                    : [
                        {
                          task,
                          time: date.valueOf(),
                          type: "resume" as const,
                        },
                      ]),
                ])
              }
            />{" "}
            [{formatTime(times.get(task) ?? 0)}] {task}
          </li>
        ))}
      </ul>
      <input
        type="button"
        value="Add new task"
        onClick={() => {
          const task = prompt();
          if (task) setTasks(new Set([...tasks, task]));
        }}
      />{" "}
      <input
        type="button"
        value="Pause all ongoing tasks"
        disabled={ongoingTasks.length === 0}
        onClick={() =>
          setEvents([
            ...events,
            ...ongoingTasks.map((task) => ({
              task,
              time: date.valueOf(),
              type: "pause" as const,
            })),
          ])
        }
      />
      <h2>Task Combinations</h2>
      <ul>
        {[...taskCombinations].map(([key, combination]) => (
          <li key={key}>
            <input
              type="button"
              value="Delete"
              onClick={() =>
                setTaskCombinations(
                  new Map(
                    [...taskCombinations].filter(([nextKey]) => key !== nextKey)
                  )
                )
              }
            />{" "}
            <input
              type="button"
              value="Resume all"
              onClick={() => {
                setEvents([
                  ...events,
                  ...combination
                    .filter((task) => !ongoingTasks.includes(task))
                    .map((task) => ({
                      task,
                      time: date.valueOf(),
                      type: "resume" as const,
                    })),
                ]);
              }}
            />{" "}
            {combination.join(", ")}
          </li>
        ))}
      </ul>
      <input
        type="button"
        value="Register this combination"
        disabled={ongoingTasks.length < 2}
        onClick={() =>
          setTaskCombinations(
            new Map([
              ...taskCombinations,
              [ongoingTasks.join(","), ongoingTasks],
            ])
          )
        }
      />
      <h2>Events</h2>
      <ul>
        {events.map(({ task, type, time }) => (
          <li key={`${time}-${task}.${type}`}>
            [{new Date(time).toLocaleString()}] {type} {task}
          </li>
        ))}
      </ul>
    </main>
  );
}
