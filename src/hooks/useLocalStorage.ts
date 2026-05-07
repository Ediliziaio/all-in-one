import { useState, useEffect, useRef } from "react";

/**
 * Drop-in replacement for useState that automatically persists to localStorage.
 * On first mount reads from localStorage (falls back to initialValue if missing/corrupt).
 * On every state change serializes to localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {}
    return initialValue;
  });

  // Skip the first render so we don't immediately overwrite good data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}
