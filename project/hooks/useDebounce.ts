import { useEffect, useState } from "react";

// delaying the load up process

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // delay the load up process
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      //   500 milliseconds
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
