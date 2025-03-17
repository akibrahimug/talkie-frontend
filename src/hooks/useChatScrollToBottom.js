import { useEffect, useRef } from 'react';

/**
 * Custom hook to scroll to the bottom of a chat container.
 * @param {any} prop - The prop to trigger the scroll.
 * @returns {React.RefObject} scrollRef - The reference to the scroll container.
 */
const useChatScrollToBottom = (prop) => {
  const scrollRef = useRef(null);

  /**
   * Effect to scroll to the bottom of the chat container when the prop changes.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);

  return scrollRef;
};
export default useChatScrollToBottom;
