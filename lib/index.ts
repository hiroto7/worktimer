export interface Task {
  readonly uuid: string;
  readonly name: string;
}

export interface EssentialEvent {
  readonly task: string;
  readonly time: number;
  readonly type: "resume" | "pause";
}

export interface TransferEvent {
  readonly from: string;
  readonly to: string;
  readonly time: number;
  readonly value: number;
  readonly type: "transfer";
}

export interface IncreaseEvent {
  readonly task: string;
  readonly time: number;
  readonly value: number;
  readonly type: "increase" | "decrease";
}

export type TaskEvent = EssentialEvent | TransferEvent | IncreaseEvent;

export interface OngoingTaskElapsedTimeParams {
  readonly startTime: number;
  readonly slowness: number;
}

export const analyzeEssentialEventSequence = (
  events: readonly EssentialEvent[],
) => {
  const elapsedTimes = new Map<string, number>();
  const ongoingTasks = new Set<string>();
  let lastEventTime: number | undefined = undefined;

  for (const { type, task, time } of events) {
    for (const ongoing of ongoingTasks) {
      const duration = time - lastEventTime!;
      elapsedTimes.set(
        ongoing,
        (elapsedTimes.get(ongoing) ?? 0) + duration / ongoingTasks.size,
      );
    }

    lastEventTime = time;

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

  return { elapsedTimes, ongoingTasks, lastEventTime };
};

export const analyzeTaskEventSequence = (events: readonly TaskEvent[]) => {
  const essentialEvents: EssentialEvent[] = [];
  const elapsedTimes = new Map<string, number>();

  for (const event of events) {
    const { type } = event;
    switch (type) {
      case "transfer": {
        const { from, to, value } = event;
        elapsedTimes.set(from, (elapsedTimes.get(from) ?? 0) - value);
        elapsedTimes.set(to, (elapsedTimes.get(to) ?? 0) + value);
        break;
      }
      case "increase": {
        const { task, value } = event;
        elapsedTimes.set(task, (elapsedTimes.get(task) ?? 0) + value);
        break;
      }
      case "decrease": {
        const { task, value } = event;
        elapsedTimes.set(task, (elapsedTimes.get(task) ?? 0) - value);
        break;
      }
      default:
        essentialEvents.push(event);
    }
  }

  const {
    elapsedTimes: timesFromEssentials,
    ongoingTasks,
    lastEventTime,
  } = analyzeEssentialEventSequence(essentialEvents);

  for (const [task, time] of timesFromEssentials)
    elapsedTimes.set(task, (elapsedTimes.get(task) ?? 0) + time);

  return { elapsedTimes, ongoingTasks, lastEventTime };
};

export const move = <T>(array: readonly T[], from: number, to: number) => {
  if (from === to) return array;
  else {
    const result = [...array];
    result.splice(from, 1);
    result.splice(to, 0, array[from]!);
    return result;
  }
};

export const capitalize = <S extends string>(text: S) =>
  (text.toUpperCase().charAt(0) + text.slice(1)) as Capitalize<S>;
