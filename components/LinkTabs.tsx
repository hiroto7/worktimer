"use client";

import { Tabs } from "@mui/material";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export const LinkTabs: React.FC<
  Pick<ComponentProps<typeof Tabs>, "children" | "centered">
> = ({ children, ...props }) => {
  const pathname = usePathname();
  return (
    <Tabs {...props} value={pathname}>
      {children}
    </Tabs>
  );
};
