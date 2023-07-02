"use client";

import { History, Home } from "@mui/icons-material";
import { LinkTab } from "./LinkTab";
import { LinkTabs } from "./LinkTabs";
import { useRecentTasks } from "@/lib/hooks/use-recent-tasks";

export const MyTabs: React.FC = () => {
  const { tasks } = useRecentTasks();
  return (
    <LinkTabs centered>
      <LinkTab value="/" icon={<Home />} label="Home" />
      <LinkTab
        value="/recent"
        icon={<History />}
        label="Recent"
        disabled={tasks.size === 0}
      />
    </LinkTabs>
  );
};
