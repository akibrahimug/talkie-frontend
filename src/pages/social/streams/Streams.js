import React, { useRef } from 'react';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch } from 'react-redux';
import { getSuggestions } from '@redux/api/suggestions';
import useEffectOnce from '@hooks/useEffectOnce';
const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getSuggestions());
  });
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <div>Post Form</div>
          <div>Post Item</div>
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
