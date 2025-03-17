import { useEffect, useRef } from 'react';

/**
 * Custom hook to ensure a callback is executed only once.
 * @param {Function} callback - The callback function to execute.
 */
const useEffectOnce = (callback) => {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      callback();
      calledOnce.current = true;
    }
  }, [callback]);
};

export default useEffectOnce;
