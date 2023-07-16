"use client";

import { TaskCards } from "@/components/TaskCards";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const AddTasksButton: React.FC<{
  onAdd: (tasks: readonly string[]) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const tasks = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Button
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          variant="contained"
        >
          Add
        </Button>
      </Box>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          display: { md: "none" },
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onTransitionExited={() => setText("")}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <DialogContentText>
            You can add multiple tasks by separating them with newlines.
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            label="Tasks"
            fullWidth
            multiline
            onChange={(event) => setText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpen(false);
              onAdd(tasks);
            }}
            disabled={tasks.length === 0}
          >
            {tasks.length <= 1 ? "Add task" : `Add ${tasks.length} tasks`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Home: React.FC = () => {
  const { tasks: names, add } = useTasks();
  const [order, setOrder] = useState<readonly string[]>();

  useEffect(() => {
    const text = localStorage.getItem("task-order");
    if (text === null) setOrder([]);
    else {
      const order = JSON.parse(text);
      setOrder(order);
    }
  }, []);

  useEffect(() => {
    if (!order) return;
    localStorage.setItem("task-order", JSON.stringify(order));
  }, [order]);

  if (order === undefined) return;

  const tasks = [...new Set([...order, ...names.keys()])]
    .filter((task) => names.has(task))
    .map((uuid) => ({ uuid, name: names.get(uuid)! }));

  return (
    <Container component="main">
      <Stack spacing={2} sx={{ my: 2 }} useFlexGap>
        <AddTasksButton onAdd={add} />
        <TaskCards tasks={tasks} onOrderChange={setOrder} />
      </Stack>
    </Container>
  );
};

export default Home;
