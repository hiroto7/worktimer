"use client";

import { TaskEvent, capitalize } from "@/lib";
import { format, getDuration } from "@/lib/duration";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useTasks } from "@/lib/hooks/use-tasks";
import {
  Add,
  Pause,
  PlayArrow,
  Remove,
  TrendingFlat,
} from "@mui/icons-material";
import {
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const getKey = (event: TaskEvent) => {
  const { type, time } = event;
  if (type === "transfer") return `${time}-transfer`;
  else {
    const { task } = event;
    return `${time}-${task}`;
  }
};

const RecentPage = () => {
  const { tasks } = useTasks();
  const { events } = useTaskEvents();

  const getEventSummary = (event: TaskEvent) => {
    const { type } = event;
    if (type === "transfer") {
      const { from, to, value } = event;
      return (
        <span>
          Transfer <b>{format(getDuration(value))}</b> from{" "}
          <b>{tasks.get(from)}</b> to <b>{tasks.get(to)}</b>
        </span>
      );
    } else {
      const { task } = event;
      return (
        <span>
          {capitalize(type)} <b>{tasks.get(task)}</b>
        </span>
      );
    }
  };

  return (
    <Container component="main" sx={{ my: 2 }}>
      <Table sx={{ width: "auto", mx: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.toReversed().map((event) => {
            const { type, time } = event;
            const Icon = {
              resume: PlayArrow,
              pause: Pause,
              transfer: TrendingFlat,
              increase: Add,
              decrease: Remove,
            }[type];

            return (
              <TableRow key={getKey(event)}>
                <TableCell component="th" scope="row">
                  {new Date(time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon />
                    {getEventSummary(event)}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};

export default RecentPage;
