import { formatTime } from "@/lib";
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
import React from "react";

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
  time: number;
  ongoing: boolean;
  onPause: () => void;
  onResume: () => void;
  onFocus: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}> = ({
  task,
  time,
  ongoing,
  onPause,
  onResume,
  onFocus,
  onRename,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "row",
        ...(ongoing
          ? {
              borderColor: "primary.main",
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
            }
          : {}),
      }}
    >
      <CardActionArea onClick={() => (ongoing ? onPause() : onFocus())}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {task}
          </Typography>
          <Typography
            variant="h3"
            color={ongoing ? "primary.dark" : "text.secondary"}
          >
            {formatTime(time)}
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
