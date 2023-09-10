"use client";

import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Pause, PlayArrow } from "@mui/icons-material";
import {
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const capitalize = <S extends string>(text: S) =>
  (text[0] !== undefined
    ? text[0].toUpperCase() + text.slice(1)
    : "") as Capitalize<S>;

const RecentPage = () => {
  const { tasks } = useTasks();
  const { events } = useTaskEvents();

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
          {events.toReversed().map(({ type, time, task }) => {
            const Icon = { resume: PlayArrow, pause: Pause }[type];
            return (
              <TableRow key={`${time}-${task}`}>
                <TableCell component="th" scope="row">
                  {new Date(time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon />
                    <span>
                      {capitalize(type)} <b>{tasks.get(task)}</b>
                    </span>
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
