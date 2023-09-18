import { IncreaseEvent, capitalize } from "@/lib";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import { DurationField } from "./DurationField";
import assert from "assert";

export const TimeIncreaseDialog: React.FC<{
  type: IncreaseEvent["type"] | undefined;
  time: number;
  onIncrease: (value: number) => void;
  onDecrease: (value: number) => void;
  onClose: () => void;
}> = ({ type: defaultType, time, onClose, onIncrease, onDecrease }) => {
  const [type, setType] = useState<IncreaseEvent["type"]>("increase");
  const [value, setValue] = useState<number>();
  const open = defaultType !== undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      onTransitionEnter={() => {
        assert(defaultType);
        setType(defaultType);
        setValue(undefined);
      }}
    >
      <DialogContent>
        <ToggleButtonGroup
          color="primary"
          value={type}
          exclusive
          onChange={(_, type: IncreaseEvent["type"] | undefined) =>
            type && setType(type)
          }
          fullWidth
        >
          <ToggleButton value={"increase"}>Increase</ToggleButton>
          <ToggleButton value={"decrease"} disabled={time <= 0}>
            Decrease
          </ToggleButton>
        </ToggleButtonGroup>
        <DurationField
          value={value}
          max={type === "decrease" ? time : undefined}
          autoFocus
          onChange={setValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onClose();
            assert(value !== undefined);
            ({ increase: onIncrease, decrease: onDecrease })[type](value);
          }}
          disabled={
            value === undefined ||
            value <= 0 ||
            (type === "decrease" && value > time)
          }
        >
          {capitalize(type)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
