import { TaskCard } from "@/components/TaskCard";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useTasks } from "@/lib/hooks/use-tasks";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

export const TaskCards: React.FC<{ tasks: ReadonlyMap<string, string> }> = ({
  tasks,
}) => {
  const { rename, remove } = useTasks();
  const { ongoingTasks, elapsedTimes, lastEventTime, resume, pause, focus } =
    useTaskEvents();
  const { push } = useRecentTasks();

  return (
    <Grid container spacing={2}>
      {[...tasks].map(([uuid, name]) => (
        <Grid xs={12} sm={6} md={4} lg={3} key={uuid}>
          <TaskCard
            task={name}
            ongoing={
              ongoingTasks.has(uuid) && lastEventTime !== undefined
                ? {
                    startTime: lastEventTime,
                    slowness: ongoingTasks.size,
                  }
                : undefined
            }
            previousElapsedTime={elapsedTimes.get(uuid) ?? 0}
            onPause={() => pause(uuid)}
            onResume={() => {
              resume(uuid);
              push(uuid);
            }}
            onFocus={() => {
              focus(uuid);
              push(uuid);
            }}
            onRename={(name) => rename(uuid, name)}
            onDelete={() => remove(uuid)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
