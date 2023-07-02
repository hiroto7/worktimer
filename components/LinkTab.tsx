import { Tab } from "@mui/material";
import Link from "next/link";
import type { ComponentProps } from "react";

export const LinkTab: React.FC<
  Pick<ComponentProps<typeof Tab>, "value" | "icon" | "label" | "disabled">
> = ({ value, ...props }) => (
  <Tab {...props} component={Link} value={value} href={value} />
);
