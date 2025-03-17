import { useEffect, useState } from 'react';
// hook to add delay on input to avoid multple unecessary api calls
const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  /**
   * Effect to set the debounce value after a delay.
   */
  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay || 600);

    return () => {
      clearTimeout(timer);
    };
  });
  return debounceValue;
};

export default useDebounce;
