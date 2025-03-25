import PropTypes from 'prop-types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaSpinner, FaRegPaperPlane } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import './ExpandableComments.scss';

/**
 * @description Expandable comments component that displays and allows adding comments
 * @param {Object} post - The post object
 * @param {boolean} isExpanded - Whether the comments section is expanded
 * @param {Function} onToggle - Function to call when the component is toggled
 * @returns {JSX} The expandable comments component
 */
const ExpandableComments = ({ post, isExpanded, onToggle }) => {
  const { profile } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const commentInputRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const dispatch = useDispatch();

  /**
   * @description Fetches comments for the post
   */
  const getPostComments = useCallback(async () => {
    if (!isExpanded) return;

    setIsLoading(true);
    try {
      const response = await postService.getPostComments(post?._id);
      setComments(response.data.comments);
    } catch (error) {
      console.log('Error fetching comments:', error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [post?._id, isExpanded]);

  /**
   * @description Handles input change for the comment field
   * @param {Object} event - The input change event
   */
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  /**
   * @description Submits a new comment
   * @param {Object} event - The form submit event
   */
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    setIsPostingComment(true);
    try {
      await postService.addComment({
        userTo: post?.userId,
        postId: post?._id,
        comment: newComment.trim(),
        profilePicture: profile?.profilePicture || ''
      });

      // Refresh comments after posting
      await getPostComments();
      setNewComment('');

      // Scroll to the bottom of the comments
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.log('Error posting comment:', error?.response?.data?.message || error.message);
    } finally {
      setIsPostingComment(false);
    }
  };

  /**
   * @description Formats the time for a comment
   * @param {string} createdAt - The creation timestamp
   * @returns {string} The formatted time string
   */
  const formatCommentTime = (createdAt) => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  /**
   * @description Focus the comment input when expanded
   */
  useEffect(() => {
    if (isExpanded && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [isExpanded]);

  /**
   * @description Fetch comments when expanded
   */
  useEffect(() => {
    if (isExpanded) {
      getPostComments();
    }
  }, [isExpanded, getPostComments]);

  return (
    <div className={`expandable-comments ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded && (
        <div className="comments-container">
          <div className="comments-header">
            <h4>Comments ({post?.commentsCount || 0})</h4>
            <button className="close-button" onClick={onToggle}>
              ×
            </button>
          </div>

          <div className="comments-list" ref={commentsContainerRef}>
            {isLoading ? (
              <div className="loading-spinner">
                <FaSpinner className="spinner" />
                <span>Loading comments...</span>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  <div className="comment-avatar">
                    <Avatar
                      name={comment.username}
                      bgColor={comment.avatarColor}
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={comment.profilePicture}
                    />
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="username">{comment.username}</span>
                      <span className="timestamp">{formatCommentTime(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

          <div className="comment-form-container">
            <form onSubmit={handleSubmitComment} className="comment-form">
              <div className="form-avatar">
                <Avatar
                  name={profile?.username}
                  bgColor={profile?.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={profile?.profilePicture}
                />
              </div>
              <div className="form-input-container">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={handleCommentChange}
                  className="comment-input"
                  ref={commentInputRef}
                  disabled={isPostingComment}
                />
                <button type="submit" className="submit-button" disabled={!newComment.trim() || isPostingComment}>
                  {isPostingComment ? <FaSpinner className="spinner" /> : <FaRegPaperPlane />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

ExpandableComments.propTypes = {
  post: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default ExpandableComments;
