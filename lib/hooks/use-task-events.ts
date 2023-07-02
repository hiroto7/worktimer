import { TaskEventsContext } from "@/lib/contexts";
import { useContext } from "react";

export const useTaskEvents = () => useContext(TaskEventsContext)!;
