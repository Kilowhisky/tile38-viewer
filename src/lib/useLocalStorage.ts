import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => unknown] {
  const [data, setData] = useState(initial);
  const callback = useCallback((value: T) => {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [key]);

  useEffect(() => {
    if (localStorage[key]) {
      setData(JSON.parse(localStorage[key]));
    }
  }, [key]);

  return [data, callback]
}