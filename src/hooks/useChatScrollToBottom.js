import { useEffect, useRef } from 'react';

const useChatScrollToBottom = (prop) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);
};

export default useChatScrollToBottom;
