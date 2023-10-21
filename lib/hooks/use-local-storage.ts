import { useEffect, useState } from "react";

export const useLocalStorage = <V>(
  key: string,
  initialValue: V,
  {
    parse,
    stringify,
  }: {
    parse: (text: string) => V;
    stringify: (value: V) => string;
  },
) => {
  const [value, setValue] = useState<V>();

  const set = (value: V) => {
    setValue(value);
    localStorage.setItem(key, stringify(value));
  };

  useEffect(() => {
    const text = localStorage.getItem(key);
    setValue(text !== null ? parse(text) : initialValue);

    const listener = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== localStorage) return;
      setValue(event.newValue !== null ? parse(event.newValue) : initialValue);
    };

    addEventListener("storage", listener);
    return () => removeEventListener("storage", listener);
  }, [key, initialValue, parse]);

  return [value, set] as const;
};
