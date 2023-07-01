import { useCallback, useState } from "react";

export const useRerender = () => {
  const [_, set] = useState(crypto.randomUUID());
  const rerender = useCallback(() => set(crypto.randomUUID()), []);
  return rerender;
};
