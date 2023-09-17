import { OngoingTaskElapsedTimeParams, Task } from "@/lib";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FormattedTime } from "./FormattedTime";

const MenuItemContent: React.FC<{
  previousElapsedTime: number;
  ongoing: OngoingTaskElapsedTimeParams | undefined;
  name: string;
}> = ({ previousElapsedTime, ongoing, name }) => {
  const time = useElapsedTime(previousElapsedTime, ongoing);

  return (
    <>
      <ListItemText>{name}</ListItemText>
      <Typography variant="body2" color="text.secondary">
        <FormattedTime time={time} blinking={ongoing !== undefined} />
      </Typography>
    </>
  );
};

export const TimeTransferDialog: React.FC<{
  tasks: readonly Task[];
  from: string | undefined;
  open: boolean;
  onClose: () => void;
}> = ({ tasks, from: defaultFrom, open, onClose }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const { transfer, elapsedTimes, lastEventTime, ongoingTasks } =
    useTaskEvents();

  const ongoing: OngoingTaskElapsedTimeParams | undefined =
    lastEventTime !== undefined
      ? {
          startTime: lastEventTime,
          slowness: ongoingTasks.size,
        }
      : undefined;

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
                <MenuItemContent
                  previousElapsedTime={elapsedTimes.get(uuid) ?? 0}
                  ongoing={ongoingTasks.has(uuid) ? ongoing : undefined}
                  name={name}
                />
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
                <MenuItemContent
                  previousElapsedTime={elapsedTimes.get(uuid) ?? 0}
                  ongoing={ongoingTasks.has(uuid) ? ongoing : undefined}
                  name={name}
                />
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
