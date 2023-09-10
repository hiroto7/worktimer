"use client";

import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { History, Home, Timeline } from "@mui/icons-material";
import { LinkTab } from "./LinkTab";
import { LinkTabs } from "./LinkTabs";
import { useTaskEvents } from "@/lib/hooks/use-task-events";

export const MyTabs: React.FC = () => {
  const { tasks } = useRecentTasks();
  const { events } = useTaskEvents();

  return (
    <LinkTabs centered>
      <LinkTab value="/" icon={<Home />} label="Home" />
      <LinkTab
        value="/recent"
        icon={<History />}
        label="Recent"
        disabled={tasks.length === 0}
      />
      <LinkTab
        value="/history"
        icon={<Timeline />}
        label="History"
        disabled={events.length === 0}
      />
    </LinkTabs>
  );
};
