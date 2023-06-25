import { css, keyframes, styled } from "@mui/material";

const blink = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
`;

const Root = styled("span")<{ blinking: boolean }>(
  ({ blinking }) =>
    blinking &&
    css`
      > span {
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-name: ${blink};
        animation-timing-function: step-end;
      }
    `
);

export const FormattedTime: React.FC<{ time: number; blinking: boolean }> = ({
  time,
  blinking,
}) => {
  const timeInSeconds = Math.round(time / 100) / 10;

  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return (
    <Root blinking={blinking}>
      {hours}
      <span>:</span>
      {minutes.toString().padStart(2, "0")}
      <span>:</span>
      {seconds.toString().padStart(2, "0")}
    </Root>
  );
};
