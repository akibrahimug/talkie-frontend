import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import { toggleReactionsModal } from '@redux/reducers/modal/modal.reducer';
import { useState, useEffect, useCallback } from 'react';
import { postService } from '@services/api/post/post.service';
import Spinner from '@components/spinner/spinner';
import { reactionsMap } from '@services/utils/static.data';
import { socketService } from '@services/sockets/socket.service';
import './ReactionsModal.scss';
import Icon from '@components/icons';

/**
 * @description Modal component that displays reactions on a post
 * @returns {JSX} The ReactionsModal component
 */
const ReactionsModal = () => {
  const { reactionsModalIsOpen } = useSelector((state) => state.modal);
  const { _id } = useSelector((state) => state.post);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  /**
   * @description Closes the reactions modal
   */
  const closeModal = () => {
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  /**
   * @description Fetches post reactions
   */
  const getPostReactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPostReactions(_id);
      setReactions(response.data.reactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [_id]);

  /**
   * @description Formats the time for a reaction
   * @param {string} createdAt - The creation timestamp
   * @returns {string} The formatted time string
   */
  const formatReactionTime = (createdAt) => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  useEffect(() => {
    getPostReactions();

    // Setup socket listeners for real-time updates
    if (_id) {
      socketService?.socket?.on('reaction', (data) => {
        if (data?.postId === _id) {
          // Refresh the reactions when a new one is added
          getPostReactions();
        }
      });

      // Cleanup socket listeners on unmount
      return () => {
        socketService?.socket?.off('reaction');
      };
    }
  }, [getPostReactions, _id]);

  return (
    <div className="reactions-modal">
      <div className="reactions-modal-content">
        <div className="reactions-modal-header">
          <h2>Reactions</h2>
          <button className="close-btn" onClick={closeModal}>
            <Icon name="X" />
          </button>
        </div>

        <div className="reactions-modal-body">
          {loading ? (
            <div className="reactions-loading">
              <Spinner />
              <p>Loading reactions...</p>
            </div>
          ) : reactions.length === 0 ? (
            <div className="no-reactions">
              <p>No reactions yet</p>
            </div>
          ) : (
            <div className="reactions-list">
              {reactions.map((reaction) => (
                <div key={reaction._id} className="reaction-item">
                  <div className="reaction-avatar">
                    <Avatar
                      name={reaction.username}
                      bgColor={reaction.avatarColor}
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={reaction.profilePicture}
                    />
                  </div>
                  <div className="reaction-info">
                    <p className="reaction-username">{reaction.username}</p>
                    <p className="reaction-time">{formatReactionTime(reaction.createdAt)}</p>
                  </div>
                  <div className="reaction-type">
                    <div className="reaction-icon">{reactionsMap[reaction.type]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionsModal;
