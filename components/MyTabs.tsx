"use client";

import { History, Home } from "@mui/icons-material";
import { LinkTab } from "./LinkTab";
import { LinkTabs } from "./LinkTabs";

export const MyTabs: React.FC = () => (
  <LinkTabs centered>
    <LinkTab value="/" icon={<Home />} label="Home" />
    <LinkTab value="/recent" icon={<History />} label="Recent" />
  </LinkTabs>
);
