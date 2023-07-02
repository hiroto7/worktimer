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
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
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

const Home = () => {
  const { tasks, add } = useTasks();

  return (
    <Container component="main">
      <Stack spacing={2} sx={{ my: 2 }} useFlexGap>
        <AddTasksButton onAdd={add} />
        <Box>
          <TaskCards tasks={tasks} />
        </Box>
      </Stack>
    </Container>
  );
};

export default Home;
