import PropTypes from 'prop-types';
import '@components/posts/comment-area/commentArea.scss';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostUtils } from '@services/utils/post.utils.service';
import { CommentUtils } from '@services/utils/comment.utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import Icon from '@components/icons';

/**
 * Comment area component.
 * @param {object} post - The post object.
 * @returns {JSX.Element} - The CommentArea component.
 */
const CommentArea = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const [setSelectedPostId] = useLocalStorage('selectedPostId', 'set');
  const dispatch = useDispatch();

  /**
   * Toggle comment input.
   */
  const toggleCommentInput = () => {
    if (!selectedPostId) {
      setSelectedPostId(post?._id);
      // Use the utility method to safely handle post data in Redux
      CommentUtils.handleCommentOperation(post, dispatch);
    } else {
      removeSelectedPostId();
    }
  };

  /**
   * Remove selected post id.
   */
  const removeSelectedPostId = () => {
    if (selectedPostId === post?._id) {
      setSelectedPostId('');
      dispatch(clearPost());
    } else {
      setSelectedPostId(post?._id);
      // Use the utility method to safely handle post data in Redux
      CommentUtils.handleCommentOperation(post, dispatch);
    }
  };

  return (
    <div className="comment-area" data-testid="comment-area">
      {/* Comment button */}
      <div className="comment-button" onClick={toggleCommentInput}>
        <span className="comment-button-icon">
          <Icon name="ChatTeardrop" className="comment-icon" weight="regular" />
        </span>
        <span>Comment</span>
      </div>
    </div>
  );
};

CommentArea.propTypes = {
  post: PropTypes.object
};

export default CommentArea;
