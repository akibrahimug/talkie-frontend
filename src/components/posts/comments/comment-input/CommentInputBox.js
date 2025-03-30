import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import { postService } from '@services/api/post/post.service';
import { PostUtils } from '@services/utils/post.utils.service';
import { CommentUtils } from '@services/utils/comment.utils.service';
import { clearPost } from '@redux/reducers/post/post.reducer';
import Icon from '@components/icons';
import './CommentInputBox.scss';

/**
 * @description Component for adding comments to a post
 * @param {Object} post - The post to add comments to
 * @returns {JSX} The CommentInputBox component
 */
const CommentInputBox = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * @description Handles submission of a new comment
   * @param {Object} event - The form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    // Clear post data before proceeding to prevent any existing media
    dispatch(clearPost());

    setIsSubmitting(true);
    try {
      await postService.addComment({
        userTo: post?.userId,
        postId: post?._id,
        comment: comment.trim(),
        profilePicture: profile?.profilePicture || ''
      });

      // Clear comment input after successful submission
      setComment('');

      // Use the utility method to safely handle post data in Redux
      // Create a new post object with updated comment count
      const updatedPost = {
        ...post,
        commentsCount: (post.commentsCount || 0) + 1
      };

      // Let the utility handle clearing and updating Redux safely
      CommentUtils.handleCommentOperation(updatedPost, dispatch);

      // Add an extra clear after a delay to catch any race conditions
      setTimeout(() => {
        dispatch(clearPost());
      }, 100);

      // You can add code here to refresh comments list if needed
    } catch (error) {
      console.log('Error posting comment:', error?.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-input-box">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="avatar-container">
            <Avatar
              name={profile?.username}
              bgColor={profile?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={profile?.profilePicture}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" disabled={!comment.trim() || isSubmitting}>
              {isSubmitting ? (
                <Icon name="SpinnerGap" className="spinner" weight="regular" />
              ) : (
                <Icon name="PaperPlane" className="comment-icon" weight="regular" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

CommentInputBox.propTypes = {
  post: PropTypes.object.isRequired
};

export default CommentInputBox;
