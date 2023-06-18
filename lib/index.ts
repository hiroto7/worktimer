export interface TaskEvent {
  readonly task: string;
  readonly time: number;
  readonly type: "resume" | "pause";
}

export const calculateTaskTimes = (
  events: readonly TaskEvent[],
  time: number
): Map<string, number> => {
  const result = new Map<string, number>();
  const ongoingTasks = new Set<string>();
  let previousEventTime: number;

  const update = (time: number) => {
    for (const ongoing of ongoingTasks) {
      const duration = time - previousEventTime;
      result.set(
        ongoing,
        (result.get(ongoing) ?? 0) + duration / ongoingTasks.size
      );
    }

    previousEventTime = time;
  };

  for (const { type, task, time } of events) {
    update(time);

    switch (type) {
      case "resume": {
        ongoingTasks.add(task);
        break;
      }
      case "pause": {
        ongoingTasks.delete(task);
        break;
      }
    }
  }

  update(time);

  return result;
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / 1000 / 3600);
  const minutes = Math.floor(((time / 1000) % 3600) / 60);
  const seconds = Math.floor((time / 1000) % 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};