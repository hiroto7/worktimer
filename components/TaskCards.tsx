import { TaskCard } from "@/components/TaskCard";
import { Task, move } from "@/lib";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useTasks } from "@/lib/hooks/use-tasks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import assert from "assert";
import { useState } from "react";

const TimeTransferDialog: React.FC<{
  tasks: readonly Task[];
  from: string | undefined;
  open: boolean;
  onClose: () => void;
}> = ({ tasks, from: defaultFrom, open, onClose }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const { transfer } = useTaskEvents();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnter={() => {
        setFrom(defaultFrom ?? "");
        setTo("");
      }}
    >
      <DialogContent>
        <FormControl margin="normal" fullWidth>
          <InputLabel>From</InputLabel>
          <Select
            label="From"
            fullWidth
            value={from}
            onChange={({ target: { value } }) => setFrom(value)}
          >
            {tasks.map(({ name, uuid }) => (
              <MenuItem value={uuid} key={uuid} disabled={uuid === to}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel>To</InputLabel>
          <Select
            autoFocus
            label="To"
            value={to}
            onChange={({ target: { value } }) => setTo(value)}
          >
            {tasks.map(({ name, uuid }) => (
              <MenuItem value={uuid} key={uuid} disabled={uuid === from}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="number"
          autoFocus
          margin="normal"
          label="Time"
          fullWidth
          onChange={({ target: { value } }) => setTime(value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={from === undefined || to === undefined || from === to}
          onClick={() => {
            transfer(+time, from!, to!);
            onClose();
          }}
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
  const [from, setFrom] = useState<string>();

  return (
    <>
      <TimeTransferDialog
        tasks={tasks}
        from={from}
        open={from !== undefined}
        onClose={() => setFrom(undefined)}
      />
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
            onDrop={(event) => {
              assert(preview);
              onOrderChange?.(preview);
              event.preventDefault();
            }}
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
              onTransfer={() => setFrom(uuid)}
              onRename={(name) => rename(uuid, name)}
              onDelete={() => remove(uuid)}
              onDragStart={() => {
                setDraggedTask(uuid);
                setPreview(tasks.map(({ uuid }) => uuid));
              }}
              onDragEnd={() => {
                setDraggedTask(undefined);
                setPreview(undefined);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
