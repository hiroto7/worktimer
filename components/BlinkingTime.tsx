import { Duration, formatToParts } from "@/lib/duration";
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
    `,
);

export const BlinkingTime: React.FC<{
  duration: Duration;
  blinking: boolean;
}> = ({ duration, blinking }) => (
  <Root blinking={blinking}>
    {formatToParts(duration).map(({ value, type }, index) =>
      type === "literal" ? <span key={index}>{value}</span> : value,
    )}
  </Root>
);
