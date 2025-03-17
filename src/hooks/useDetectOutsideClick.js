// hook to enfore dropdown close if there is an outside click
import { useEffect, useState } from 'react';

/**
 * Custom hook to detect outside clicks and manage the dropdown state.
 * @param {React.RefObject} ref - The reference to the dropdown element.
 * @param {boolean} initialState - The initial state of the dropdown.
 * @returns {[boolean, (value: boolean) => void]} - The state and setter for the dropdown.
 */
const useDetectOutsidelick = (ref, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  /**
   * Effect to detect outside clicks and manage the dropdown state.
   */
  useEffect(() => {
    const onClick = (event) => {
      if (ref.current !== null && !ref.current.contains(event.target)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('mousedown', onClick);
    }
    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);
  return [isActive, setIsActive];
};
export default useDetectOutsidelick;
