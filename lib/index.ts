export interface TaskEvent {
  readonly task: string;
  readonly time: number;
  readonly type: "resume" | "pause";
}

export interface OngoingTaskElapsedTimeParams {
  readonly startTime: number;
  readonly slowness: number;
}

export const analyzeTaskEventSequence = (events: readonly TaskEvent[]) => {
  const elapsedTimes = new Map<string, number>();
  const ongoingTasks = new Set<string>();
  let previousEventTime: number;

  for (const { type, task, time } of events) {
    for (const ongoing of ongoingTasks) {
      const duration = time - previousEventTime!;
      elapsedTimes.set(
        ongoing,
        (elapsedTimes.get(ongoing) ?? 0) + duration / ongoingTasks.size
      );
    }

    previousEventTime = time;

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

  return { elapsedTimes, ongoingTasks };
};
