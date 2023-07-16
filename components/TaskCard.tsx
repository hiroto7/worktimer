import { OngoingTaskElapsedTimeParams } from "@/lib";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import {
  Delete,
  Edit,
  Highlight,
  MoreVert,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { FormattedTime } from "./FormattedTime";

const MoreMenuButton: React.FC<{
  deleteDisabled: boolean;
  onFocus: () => void;
  onRename: () => void;
  onDelete: () => void;
}> = ({ deleteDisabled, onFocus, onRename, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            onFocus();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Highlight />
          </ListItemIcon>
          <ListItemText>Solo</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onRename();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={deleteDisabled}
          onClick={() => {
            onDelete();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export const TaskCard: React.FC<{
  task: string;
  previousElapsedTime: number;
  ongoing: OngoingTaskElapsedTimeParams | undefined;
  draggable: boolean;
  active: boolean;
  onPause: () => void;
  onResume: () => void;
  onFocus: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}> = ({
  task,
  previousElapsedTime,
  ongoing,
  draggable,
  active,
  onPause,
  onResume,
  onFocus,
  onRename,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const theme = useTheme();
  const time = useElapsedTime(previousElapsedTime, ongoing);
  const [dragging, setDragging] = useState(false);

  return (
    <Card
      draggable={draggable}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "row",
        ...(active
          ? {
              borderColor: "primary.main",
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
            }
          : {}),
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task);
        setDragging(true);
        onDragStart();
      }}
      onDragEnd={() => {
        setDragging(false);
        onDragEnd();
      }}
    >
      <CardActionArea
        onClick={ongoing ? onPause : onFocus}
        disableRipple={dragging}
      >
        <CardContent>
          <Typography variant="h5" component="h3">
            {task}
          </Typography>
          <Typography
            variant="h3"
            color={active ? "primary.main" : "text.secondary"}
          >
            <FormattedTime time={time} blinking={!!ongoing} />
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions
        disableSpacing
        sx={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <MoreMenuButton
          deleteDisabled={time > 0}
          onFocus={onFocus}
          onRename={() => {
            const name = prompt(undefined, task);
            if (name) onRename(name);
          }}
          onDelete={onDelete}
        />
        {ongoing ? (
          <IconButton onClick={onPause}>
            <Pause />
          </IconButton>
        ) : (
          <IconButton onClick={onResume}>
            <PlayArrow />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
