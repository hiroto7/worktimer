import { FormattedTime } from "@/components/FormattedTime";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import { Clear, GitHub, Pause } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export const MyAppBar: React.FC<{
  previousElapsedTime: number;
  startTime: number | undefined;
  onPause: () => void;
  onClear: () => void;
}> = ({ previousElapsedTime, startTime, onPause, onClear }) => {
  const ongoing = startTime !== undefined;
  const elapsedTime = useElapsedTime(
    previousElapsedTime,
    ongoing ? { startTime, slowness: 1 } : undefined
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
        <IconButton color="inherit" disabled={!ongoing} onClick={onPause}>
          <Pause />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={elapsedTime === 0}
          onClick={() =>
            confirm("Are you sure you want to clear time for all tasks?") &&
            onClear()
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
