import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import { toggleCommentsModal } from '@redux/reducers/modal/modal.reducer';
import { useState, useEffect, useCallback, useRef } from 'react';
import { postService } from '@services/api/post/post.service';
import Spinner from '@components/spinner/spinner';
import './CommentsModal.scss';

/**
 * @description Modal component that displays comments on a post
 * @returns {JSX} The CommentsModal component
 */
const CommentsModal = () => {
  const { commentsModalIsOpen } = useSelector((state) => state.modal);
  const { _id } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);
  const dispatch = useDispatch();

  /**
   * @description Closes the comments modal
   */
  const closeModal = () => {
    dispatch(toggleCommentsModal(!commentsModalIsOpen));
  };

  /**
   * @description Fetches post comments
   */
  const getPostComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPostComments(_id);
      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [_id]);

  /**
   * @description Handles the submission of a new comment
   * @param {Object} event - The form submission event
   */
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await postService.addComment({
        userTo: comments[0]?.userId || '',
        postId: _id,
        comment: newComment.trim(),
        profilePicture: profile?.profilePicture || ''
      });

      // Refresh comments
      await getPostComments();
      setNewComment('');

      // Scroll to the bottom to see new comment
      scrollToBottom();
    } catch (error) {
      console.log('Error posting comment:', error);
    } finally {
      setSubmitting(false);
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
   * @description Scrolls to the bottom of the comments list
   */
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    getPostComments();
  }, [getPostComments]);

  useEffect(() => {
    if (!loading && comments.length > 0) {
      scrollToBottom();
    }
  }, [loading, comments]);

  return (
    <div className="comments-modal">
      <div className="comments-modal-content">
        <div className="comments-modal-header">
          <h2>Comments</h2>
          <button className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        <div className="comments-modal-body">
          {loading ? (
            <div className="comments-loading">
              <Spinner />
              <p>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
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
              ))}
              <div ref={commentsEndRef} />
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
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
                disabled={submitting}
              />
              <button type="submit" className="submit-button" disabled={!newComment.trim() || submitting}>
                {submitting ? <Spinner /> : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
