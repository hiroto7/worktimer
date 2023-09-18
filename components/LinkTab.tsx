import { Tab } from "@mui/material";
import Link from "next/link";
import type { ComponentProps } from "react";

export const LinkTab: React.FC<
  Pick<ComponentProps<typeof Tab>, "icon" | "label" | "disabled"> & {
    value: string | URL;
  }
> = ({ value, ...props }) => <Tab {...props} component={Link} href={value} />;
