"use client";

import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";
import { useTaskEvents } from "@/lib/hooks/use-task-events";
import { History, Home, Sort, Timeline } from "@mui/icons-material";
import { LinkTab } from "./LinkTab";
import { LinkTabs } from "./LinkTabs";

export const MyTabs: React.FC = () => {
  const { tasks } = useRecentTasks();
  const { events, elapsedTimes } = useTaskEvents();

  return (
    <LinkTabs centered>
      <LinkTab value="/" icon={<Home />} label="All" />
      <LinkTab
        value="/recent/"
        icon={<History />}
        label="Recent"
        disabled={tasks.length === 0}
      />
      <LinkTab
        value="/top/"
        icon={<Sort />}
        label="Top"
        disabled={elapsedTimes.size === 0}
      />
      <LinkTab
        value="/history/"
        icon={<Timeline />}
        label="History"
        disabled={events.length === 0}
      />
    </LinkTabs>
  );
};
