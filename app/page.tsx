"use client";

import { TaskCards } from "@/components/TaskCards";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useTasks } from "@/lib/hooks/use-tasks";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

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

const INITIAL_VALUE = [] as const;

const Home: React.FC = () => {
  const { tasks: names, add } = useTasks();
  const [order, setOrder] = useLocalStorage<readonly string[]>(
    "task-order",
    INITIAL_VALUE,
    JSON,
  );

  if (order === undefined) return;

  const tasks = [...new Set([...order, ...names.keys()])];

  return (
    <main>
      <Stack spacing={2} sx={{ my: 2 }} useFlexGap>
        <AddTasksButton onAdd={add} />
        <TaskCards tasks={tasks} onOrderChange={setOrder} />
      </Stack>
    </main>
  );
};

export default Home;
