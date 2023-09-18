import { useTasks } from "./use-tasks";

export const useTaskSequence = (taskUUIDs: readonly string[]) => {
  const { tasks: names } = useTasks();
  const tasks = taskUUIDs
    .filter((task) => names.has(task))
    .map((uuid) => ({ uuid, name: names.get(uuid)! }));

  return tasks;
};
