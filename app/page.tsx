"use client";

import { TaskEvent, calculateTaskTimes, formatTime } from "@/lib";
import { useDate } from "@/lib/hooks/use-date";
import {
  Add,
  Clear,
  Delete,
  Edit,
  GitHub,
  Highlight,
  MoreVert,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  Fab,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React, { useState } from "react";

const MoreMenuButton: React.FC<{
  deleteDisabled: boolean;
  onFocus: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}> = ({ deleteDisabled, onFocus, onRename, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            onFocus();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Highlight />
          </ListItemIcon>
          <ListItemText>Solo</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const name = prompt();
            if (name) onRename(name);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem disabled={deleteDisabled} onClick={onDelete}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const TaskCard: React.FC<{
  task: string;
  time: number;
  ongoing: boolean;
  onPause: () => void;
  onResume: () => void;
  onFocus: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}> = ({
  task,
  time,
  ongoing,
  onPause,
  onResume,
  onFocus,
  onRename,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "row",
        ...(ongoing
          ? {
              borderColor: "primary.main",
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
            }
          : {}),
      }}
    >
      <CardActionArea onClick={() => (ongoing ? onPause() : onFocus())}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {task}
          </Typography>
          <Typography
            variant="h3"
            color={ongoing ? "primary.dark" : "text.secondary"}
          >
            {formatTime(time)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions
        disableSpacing
        sx={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <MoreMenuButton
          deleteDisabled={time > 0}
          onFocus={onFocus}
          onRename={onRename}
          onDelete={onDelete}
        />
        {ongoing ? (
          <IconButton onClick={onPause}>
            <Pause />
          </IconButton>
        ) : (
          <IconButton onClick={onResume}>
            <PlayArrow />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

const Home = () => {
  const [events, setEvents] = useState<readonly TaskEvent[]>([]);
  const [tasks, setTasks] = useState<ReadonlyMap<string, string>>(new Map());
  const date = useDate();

  const times = calculateTaskTimes(events, date.valueOf());
  const totalTime = [...times.values()].reduce(
    (previous, current) => previous + current,
    0
  );

  const ongoingTasks = [...tasks.keys()].filter(
    (task) => events.findLast((event) => event.task === task)?.type === "resume"
  );

  const resume = (task: string) =>
    setEvents([
      ...events,
      {
        task,
        time: date.valueOf(),
        type: "resume",
      },
    ]);

  const pause = (task: string) =>
    setEvents([
      ...events,
      {
        task,
        time: date.valueOf(),
        type: "pause",
      },
    ]);

  const focus = (task: string) =>
    setEvents([
      ...events,
      ...ongoingTasks
        .filter((ongoing) => ongoing !== task)
        .map((task) => ({
          task,
          time: date.valueOf(),
          type: "pause" as const,
        })),
      ...(ongoingTasks.includes(task)
        ? []
        : [
            {
              task,
              time: date.valueOf(),
              type: "resume" as const,
            },
          ]),
    ]);

  const add = () => {
    const task = prompt();
    if (task) setTasks(new Map([...tasks, [crypto.randomUUID(), task]]));
  };

  const rename = (uuid: string, name: string) =>
    setTasks(new Map([...tasks, [uuid, name]]));

  const deleteTask = (task: string) =>
    setTasks(new Map([...tasks].filter(([key]) => key !== task)));

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            worktimer
          </Typography>
          <Typography variant="body1" mr={1}>
            {formatTime(totalTime)}
          </Typography>
          <IconButton
            color="inherit"
            disabled={ongoingTasks.length === 0}
            onClick={() =>
              setEvents([
                ...events,
                ...ongoingTasks.map((task) => ({
                  task,
                  time: date.valueOf(),
                  type: "pause" as const,
                })),
              ])
            }
          >
            <Pause />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={events.length === 0}
            onClick={() =>
              confirm("Are you sure you want to clear time for all tasks?") &&
              setEvents([])
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
      <Fab
        color="primary"
        onClick={add}
        sx={{
          display: { md: "none" },
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
      <Container component="main">
        <Stack spacing={2} sx={{ my: 2 }} useFlexGap>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button startIcon={<Add />} onClick={add} variant="contained">
              Add
            </Button>
          </Box>
          <Box>
            <Grid container spacing={2}>
              {[...tasks].map(([uuid, name]) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={uuid}>
                  <TaskCard
                    task={name}
                    ongoing={ongoingTasks.includes(uuid)}
                    time={times.get(uuid) ?? 0}
                    onPause={() => pause(uuid)}
                    onResume={() => resume(uuid)}
                    onFocus={() => focus(uuid)}
                    onRename={(name) => rename(uuid, name)}
                    onDelete={() => deleteTask(uuid)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Home;