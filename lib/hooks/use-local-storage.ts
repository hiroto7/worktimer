import { useEffect, useState } from "react";

export const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState<string>();

  const set = (value: string) => {
    setValue(value);
    localStorage.setItem(key, value);
  };

  useEffect(() => {
    setValue(localStorage.getItem(key) ?? initialValue);

    const listener = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== localStorage) return;
      setValue(event.newValue ?? initialValue);
    };

    addEventListener("storage", listener);
    return () => removeEventListener("storage", listener);
  }, [key, initialValue]);

  return [value, set] as const;
};
