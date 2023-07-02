import { RecentTasksContext } from "@/lib/contexts";
import { useContext } from "react";

export const useRecentTasks = () => useContext(RecentTasksContext)!;
