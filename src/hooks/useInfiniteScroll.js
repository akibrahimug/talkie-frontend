// as user scrolls we want ne data to load
import { useCallback, useEffect } from 'react';

/**
 * Custom hook to handle infinite scrolling.
 * @param {React.RefObject} bodyRef - The reference to the body element.
 * @param {React.RefObject} bottomLineRef - The reference to the bottom line element.
 * @param {Function} callback - The callback function to execute when the bottom line is reached.
 */
const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
    const { top: bottomLineTop } = bottomLineRef?.current?.getBoundingClientRect();

    if (bottomLineTop <= containerHeight) {
      // call the api to fetch more
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  /**
   * Effect to add event listener for scroll events on the body.
   */
  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);

    return () => {
      bodyRefCurrent?.removeEventListener('scroll', handleScroll, true);
    };
  }, [bodyRef, handleScroll]);
};
export default useInfiniteScroll;
