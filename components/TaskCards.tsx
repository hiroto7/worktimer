import { TaskCard } from "@/components/TaskCard";
import { Task, move } from "@/lib";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useTasks } from "@/lib/hooks/use-tasks";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import assert from "assert";
import { useState } from "react";

export const TaskCards: React.FC<{
  tasks: readonly Task[];
  onOrderChange: ((tasks: readonly string[]) => void) | undefined;
}> = ({ tasks, onOrderChange }) => {
  const { rename, remove } = useTasks();
  const { ongoingTasks, elapsedTimes, lastEventTime, resume, pause, focus } =
    useTaskEvents();
  const { push } = useRecentTasks();
  const [draggedTask, setDraggedTask] = useState<string>();
  const [preview, setPreview] = useState<readonly string[]>();

  return (
    <Grid container spacing={2}>
      {(
        preview?.map((uuid) => ({
          uuid,
          name: tasks.find((task) => task.uuid === uuid)!.name,
        })) ?? tasks
      ).map(({ uuid, name }, index) => (
        <Grid
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={uuid}
          onDrop={console.log}
          onDragEnter={() => {
            assert(preview !== undefined && draggedTask !== undefined);
            const draggedIndex = preview.indexOf(draggedTask);
            if (draggedIndex !== index)
              setPreview(move(preview, draggedIndex, index));
          }}
          onDragOver={(event) => event.preventDefault()}
        >
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
            active={
              (draggedTask === undefined && ongoingTasks.has(uuid)) ||
              draggedTask === uuid
            }
            previousElapsedTime={elapsedTimes.get(uuid) ?? 0}
            draggable={!!onOrderChange}
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
            onDragStart={() => {
              setDraggedTask(uuid);
              setPreview(tasks.map(({ uuid }) => uuid));
            }}
            onDragEnd={() => {
              assert(preview);
              onOrderChange?.(preview);
              setDraggedTask(undefined);
              setPreview(undefined);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};
