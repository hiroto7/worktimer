import { Task } from "@/lib";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
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
import { useState } from "react";

export const TimeTransferDialog: React.FC<{
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
