"use client";

import { FormattedTime } from "@/components/FormattedTime";
import { TaskCard } from "@/components/TaskCard";
import { TaskEvent, calculateTaskTimes } from "@/lib";
import { useDate } from "@/lib/hooks/use-date";
import { Add, Clear, GitHub, Pause } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Fab,
  IconButton,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useMemo, useState } from "react";

const Home = () => {
  const [events, setEvents] = useState<readonly TaskEvent[]>();
  const [tasks, setTasks] = useState<ReadonlyMap<string, string>>();
  const date = useDate();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    const text = localStorage.getItem("tasks");
    if (text === null) setTasks(new Map());
    else {
      const tasks = new Map(Object.entries<string>(JSON.parse(text)));
      setTasks(tasks);
    }
  }, []);

  useEffect(() => {
    const text = localStorage.getItem("events");
    if (text === null) setEvents([]);
    else {
      const events: TaskEvent[] = JSON.parse(text);
      setEvents(events);
    }
  }, []);

  useEffect(() => {
    if (tasks === undefined) return;
    localStorage.setItem("tasks", JSON.stringify(Object.fromEntries(tasks)));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  if (events === undefined || tasks === undefined) return undefined;

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            worktimer
          </Typography>
          <Typography variant="body1" mr={1}>
            <FormattedTime
              time={totalTime}
              blinking={ongoingTasks.length > 0}
            />
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
    </ThemeProvider>
  );
};

export default Home;