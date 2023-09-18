import { useState } from "react";

export const useRerender = () => {
  const [value, setValue] = useState(0);
  const rerender = () => setValue(value ^ 1);
  return rerender;
};
