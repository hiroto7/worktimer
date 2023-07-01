import { OngoingTaskElapsedTimeParams } from "@/lib";
import { useRerender } from "@/lib/hooks/use-rerender";
import { useEffect } from "react";

const interval = 1000;

export const useElapsedTime = (
  previousElapsedTime: number,
  ongoing: OngoingTaskElapsedTimeParams | undefined
) => {
  const rerender = useRerender();
  const elapsedTime =
    ongoing !== undefined
      ? previousElapsedTime +
        (Date.now() - ongoing.startTime) / ongoing.slowness
      : previousElapsedTime;

  useEffect(() => {
    if (ongoing === undefined) return;

    const rest = interval - (elapsedTime % interval);
    const timeout = setTimeout(() => rerender(), rest * ongoing.slowness);
    return () => clearTimeout(timeout);
  }, [elapsedTime, ongoing, rerender]);

  return elapsedTime;
};
