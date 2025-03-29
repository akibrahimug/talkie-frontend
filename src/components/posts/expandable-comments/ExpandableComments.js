import PropTypes from 'prop-types';
import '@components/posts/expandable-comments/ExpandableComments.scss';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { updatePostItem, clearPost } from '@redux/reducers/post/post.reducer';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.service';
import { timeAgo } from '@services/utils/timeago.utils.service';
import { socketService } from '@services/sockets/socket.service';
import { PostUtils } from '@services/utils/post.utils.service';
import { CommentUtils } from '@services/utils/comment.utils.service';
import Icon from '@components/icons';

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
   * @description Clears image and GIF data from Redux store without removing other post data
   */
  const clearPostMedia = () => {
    // Instead of manually clearing fields, use the utility function
    if (post) {
      CommentUtils.handleCommentOperation(post, dispatch);
    } else {
      // If no post is provided, just clear everything
      dispatch(clearPost());
    }
  };

  /**
   * @description Fetches comments for the post
   * @returns {Promise} A promise that resolves to the comments
   * @throws {Error} If there is an error fetching the comments
   */
  const getPostComments = useCallback(async () => {
    if (!isExpanded) return;

    setIsLoading(true);
    try {
      // Add null check to handle potential undefined response during testing
      const response = await postService.getPostComments(post?._id);

      if (response && response.data && response.data.comments) {
        setComments(response.data.comments);
      } else {
        console.log('Invalid response format from getPostComments');
        setComments([]);
      }
    } catch (error) {
      console.log('Error fetching comments:', error?.message || 'Unknown error');
      Utils.dispatchNotification(dispatch, 'Error loading comments', 'error');
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [post?._id, isExpanded, dispatch]);

  /**
   * @description Handles input change for the comment field
   * @param {Object} event - The input change event
   * @returns {void}
   * @throws {Error} If there is an error handling the comment change
   */
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  /**
   * @description Submits a new comment
   * @param {Object} event - The form submit event
   * @returns {Promise} A promise that resolves when the comment is submitted
   * @throws {Error} If there is an error submitting the comment
   */
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    // First clear any existing post data
    dispatch(clearPost());

    setIsPostingComment(true);
    try {
      const response = await postService.addComment({
        userTo: post?.userId,
        postId: post?._id,
        comment: newComment.trim(),
        profilePicture: profile?.profilePicture || ''
      });

      // Create updated post with increased comment count
      const updatedPost = {
        ...post,
        commentsCount: (post.commentsCount || 0) + 1
      };

      // Use the utility method to safely handle post data in Redux
      CommentUtils.handleCommentOperation(updatedPost, dispatch);

      // Emit Socket.IO event to notify other users about the new comment
      if (response && response.data) {
        const commentData = {
          userTo: post?.userId,
          postId: post?._id,
          username: profile?.username,
          avatarColor: profile?.avatarColor,
          comment: newComment.trim(),
          profilePicture: profile?.profilePicture || '',
          commentsCount: updatedPost.commentsCount
        };

        try {
          socketService?.socket?.emit('comment', commentData);
        } catch (socketError) {
          console.log('Socket emit error:', socketError);
          // Continue even if socket emit fails - the API call succeeded
        }
      }

      // Refresh comments after posting
      await getPostComments();
      setNewComment('');

      // Scroll to the bottom of the comments
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
      }
    } catch (error) {
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error posting comment', 'error');
    } finally {
      setIsPostingComment(false);
    }
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
      // First directly clear the post state
      dispatch(clearPost());

      // Then use the utility method which will safely handle the state
      CommentUtils.handleCommentOperation(post, dispatch, getPostComments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  /**
   * @description Set up Socket.IO listeners for real-time comment updates
   */
  useEffect(() => {
    if (isExpanded && post?._id) {
      // Listen for new comments on this post - use 'Update comment' to match backend event name
      const handleCommentUpdate = (data) => {
        if (data.postId === post._id) {
          // Refresh comments when a new comment is added to this post
          getPostComments();
        }
      };

      socketService?.socket?.on('Update comment', handleCommentUpdate);

      // Cleanup listener when component unmounts or post changes
      return () => {
        socketService?.socket?.off('Update comment', handleCommentUpdate);
      };
    }
  }, [isExpanded, post?._id, getPostComments]);

  /**
   * @description Clear post data when component is closed
   */
  useEffect(() => {
    if (!isExpanded) {
      // Clear post data when component is closed
      dispatch(clearPost());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <div className={`expandable-comments ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded && (
        <div className="comments-container">
          <div className="comments-header">
            <h4>Comments ({post?.commentsCount || comments.length || 0})</h4>
            <button className="close-button" onClick={onToggle}>
              ×
            </button>
          </div>

          <div className="comments-list" ref={commentsContainerRef}>
            {isLoading ? (
              <div className="loading-spinner">
                <Icon name="SpinnerGap" className="spinner" weight="regular" />
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
                      <span className="timestamp">{timeAgo.transform(comment.createdAt)}</span>
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
                  {isPostingComment ? (
                    <Icon name="SpinnerGap" className="spinner" weight="regular" />
                  ) : (
                    <Icon name="PaperPlane" className="comment-icon" weight="regular" />
                  )}
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
