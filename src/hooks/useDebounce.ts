import { useEffect, useState } from "react";
import { MermaidFile } from "../MermaidFile.js";

export const useDebounce = (value: { code: string, file: MermaidFile } | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
