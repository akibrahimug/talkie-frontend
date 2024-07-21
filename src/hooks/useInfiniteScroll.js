// as user scrolls we want ne data to load
import { useCallback, useEffect } from 'react';
const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientHeight().height;
    const { top: bottomLineTop } = bottomLineRef?.current?.getBoundingClientHeight().height;

    if (bottomLineTop <= containerHeight) {
      // call the api to fetch more
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);
  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);

    return () => {
      bodyRefCurrent.removeEventListener('scroll', handleScroll, true);
    };
  }, [bodyRef, handleScroll]);
};
export default useInfiniteScroll;
