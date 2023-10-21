import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

dayjs.extend(utc);

const BASE = dayjs.utc("2023-09-21T00:00:00Z");

export const DurationField: React.FC<{
  value: number | undefined;
  max: number | undefined;
  autoFocus: boolean;
  onChange: (value: number | undefined) => void;
}> = ({ value: millisecond, max, autoFocus, onChange }) => {
  const [internalValue, setInternalValue] = useState<Dayjs | null>(null);

  const value =
    millisecond !== undefined
      ? BASE.add(millisecond, "millisecond")
      : internalValue;
  const maxTime =
    max !== undefined && max < 1000 * 60 * 60 * 24
      ? BASE.add(max, "millisecond")
      : undefined;

  const handleChange = (value: Dayjs | null) => {
    setInternalValue(value);
    onChange(
      value?.isValid() ? value.diff(BASE, "millisecond", true) : undefined,
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimeField
        value={value}
        {...(maxTime ? { maxTime } : undefined)}
        autoFocus={autoFocus}
        margin="normal"
        label="Time"
        fullWidth
        format="HH:mm:ss"
        timezone="UTC"
        referenceDate={BASE}
        onChange={handleChange}
      />
    </LocalizationProvider>
  );
};
