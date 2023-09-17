import { Temporal } from "@js-temporal/polyfill";

export type Duration = Record<"hours" | "minutes" | "seconds", number>;

export const formatToParts = ({ hours, minutes, seconds }: Duration) =>
  [
    { type: "integer", value: hours.toString(), unit: "hour" },
    { type: "literal", value: ":" },
    {
      type: "integer",
      value: minutes.toString().padStart(2, "0"),
      unit: "minute",
    },
    { type: "literal", value: ":" },
    {
      type: "integer",
      value: seconds.toString().padStart(2, "0"),
      unit: "second",
    },
  ] as const;

export const format = (duration: Duration) =>
  formatToParts(duration)
    .map(({ value }) => value)
    .join("");

export const getDuration = (time: number) =>
  Temporal.Duration.from({
    milliseconds: Math.round(time),
  }).round({
    largestUnit: "hour",
    smallestUnit: "second",
    roundingMode: "trunc",
  });
