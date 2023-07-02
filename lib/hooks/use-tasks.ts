import { TasksContext } from "@/lib/contexts";
import { useContext } from "react";

export const useTasks = () => useContext(TasksContext)!;
