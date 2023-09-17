import { OngoingTaskElapsedTimeParams, Task } from "@/lib";
import { format, getDuration } from "@/lib/duration";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { SwapHoriz, SwapVert } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { BlinkingTime } from "./BlinkingTime";

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
        <BlinkingTime
          duration={getDuration(time)}
          blinking={ongoing !== undefined}
        />
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
  const [text, setText] = useState("");
  const { transfer, elapsedTimes, lastEventTime, ongoingTasks } =
    useTaskEvents();

  const time = +text * 1000;

  const ongoing: OngoingTaskElapsedTimeParams | undefined =
    lastEventTime !== undefined
      ? {
          startTime: lastEventTime,
          slowness: ongoingTasks.size,
        }
      : undefined;

  const fromTime = useElapsedTime(
    elapsedTimes.get(from) ?? 0,
    ongoingTasks.has(from) ? ongoing : undefined
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnter={() => {
        setFrom(defaultFrom ?? "");
        setTo("");
        setText("");
      }}
      fullWidth
    >
      <DialogContent>
        <Grid
          container
          spacing={{ sm: 1 }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid xs={12} sm>
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
          </Grid>
          <Grid xs="auto">
            <IconButton
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <SwapHoriz sx={{ display: { xs: "none", sm: "block" } }} />
              <SwapVert sx={{ display: { sm: "none" } }} />
            </IconButton>
          </Grid>
          <Grid xs={12} sm>
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
          </Grid>
        </Grid>
        <TextField
          type="number"
          autoFocus
          margin="normal"
          label="Time"
          fullWidth
          onChange={({ target: { value } }) => setText(value)}
          helperText={format(getDuration(Math.max(time, 0)))}
          inputProps={{
            min: 1,
            max: from !== "" ? Math.round(fromTime / 1000) : undefined,
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={from === "" || to === "" || time <= 0 || time > fromTime}
          onClick={() => {
            transfer(time, from, to);
            onClose();
          }}
        >
          Transfer {format(getDuration(Math.max(time, 0)))}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
