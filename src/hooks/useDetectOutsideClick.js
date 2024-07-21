// hook to enfore dropdown close if there is an outside click
import { useEffect, useState } from 'react';
const useDetectOutsidelick = (ref, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

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
