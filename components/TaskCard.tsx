import { IncreaseEvent, OngoingTaskElapsedTimeParams } from "@/lib";
import { getDuration } from "@/lib/duration";
import { useElapsedTime } from "@/lib/hooks/use-elapsed-time";
import {
  Add,
  Delete,
  Edit,
  Highlight,
  MoreVert,
  Pause,
  PlayArrow,
  Remove,
  TrendingFlat,
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
import { BlinkingTime } from "./BlinkingTime";
import { TimeIncreaseDialog } from "./TimeIncreaseDialog";

const MoreMenuButton: React.FC<{
  decreaseDisabled: boolean;
  deleteDisabled: boolean;
  onFocus: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onTransfer: () => void;
  onRename: () => void;
  onDelete: () => void;
}> = ({
  decreaseDisabled,
  deleteDisabled,
  onFocus,
  onIncrease,
  onDecrease,
  onTransfer,
  onRename,
  onDelete,
}) => {
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
            <Highlight fontSize="small" />
          </ListItemIcon>
          <ListItemText>Solo</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onIncrease();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Increase time</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={decreaseDisabled}
          onClick={() => {
            onDecrease();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Remove fontSize="small" />
          </ListItemIcon>
          <ListItemText>Decrease time</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onTransfer();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <TrendingFlat fontSize="small" />
          </ListItemIcon>
          <ListItemText>Transfer time to another task</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onRename();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
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
            <Delete fontSize="small" />
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
  deleteDisabled: boolean;
  onPause: () => void;
  onResume: () => void;
  onFocus: () => void;
  onIncrease: (time: number) => void;
  onDecrease: (time: number) => void;
  onTransfer: () => void;
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
  deleteDisabled,
  onPause,
  onResume,
  onFocus,
  onIncrease,
  onDecrease,
  onTransfer,
  onRename,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const theme = useTheme();
  const time = useElapsedTime(previousElapsedTime, ongoing);
  const [dragging, setDragging] = useState(false);
  const [type, setType] = useState<IncreaseEvent["type"]>();

  return (
    <>
      <TimeIncreaseDialog
        type={type}
        time={time}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onClose={() => setType(undefined)}
      />
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
              <BlinkingTime duration={getDuration(time)} blinking={!!ongoing} />
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions
          disableSpacing
          sx={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          <MoreMenuButton
            decreaseDisabled={time <= 0}
            deleteDisabled={deleteDisabled}
            onFocus={onFocus}
            onIncrease={() => setType("increase")}
            onDecrease={() => setType("decrease")}
            onTransfer={onTransfer}
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
    </>
  );
};
