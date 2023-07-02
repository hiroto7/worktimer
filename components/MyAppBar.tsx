"use client";

import { FormattedTime } from "@/components/FormattedTime";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { Clear, GitHub, Pause } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export const MyAppBar: React.FC = () => {
  const { elapsedTimes, ongoingTasks, lastEventTime, pauseAll, clear } =
    useTaskEvents();

  const totalTime = [...elapsedTimes.values()].reduce(
    (previous, current) => previous + current,
    0
  );

  const ongoing = ongoingTasks.size > 0 && lastEventTime !== undefined;
  const elapsedTime = useElapsedTime(
    totalTime,
    ongoing ? { startTime: lastEventTime, slowness: 1 } : undefined
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          worktimer
        </Typography>
        <Typography variant="body1" mr={1}>
          <FormattedTime time={elapsedTime} blinking={ongoing} />
        </Typography>
        <IconButton color="inherit" disabled={!ongoing} onClick={pauseAll}>
          <Pause />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={elapsedTime === 0}
          onClick={() =>
            confirm("Are you sure you want to clear time for all tasks?") &&
            clear()
          }
        >
          <Clear />
        </IconButton>
        <IconButton
          href="https://github.com/hiroto7/worktimer/"
          color="inherit"
        >
          <GitHub />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
