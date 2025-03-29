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
import Reactions from '@components/posts/reactions/reactions';
import { cloneDeep, filter, find } from 'lodash';
import { Utils } from '@services/utils/utils.service';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { PostUtils } from '@services/utils/post.utils.service';

/**
 * @description Modal component that displays reactions on a post
 * @returns {JSX} The ReactionsModal component
 */
const ReactionsModal = () => {
  const { reactionsModalIsOpen } = useSelector((state) => state.modal);
  const post = useSelector((state) => state.post);
  const { _id, reactions: postReactions } = post;
  const { profile } = useSelector((state) => state.user);
  let { reactions: userReactions = [] } = useSelector((state) => state.userPostReactions || { reactions: [] });
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSelectedReaction, setUserSelectedReaction] = useState('');
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
   * @description Get user's current reaction
   */
  const getUserReaction = useCallback(() => {
    // First try to find the reaction in userReactions
    const userReaction = find(userReactions, (reaction) => reaction.postId === _id);

    if (userReaction) {
      // Only set the selected reaction if the count is non-zero
      const reactionCount = postReactions?.[userReaction.type] || 0;
      if (reactionCount > 0) {
        setUserSelectedReaction(userReaction.type);
      } else {
        setUserSelectedReaction('');
      }
    } else {
      setUserSelectedReaction('');
    }
  }, [_id, userReactions, postReactions]);

  // Add effect to check for zero reaction counts
  useEffect(() => {
    // Check if there are any reactions of the user's selected type
    // If not, reset the button state to unselected
    if (userSelectedReaction && postReactions) {
      const reactionCount = postReactions[userSelectedReaction] || 0;
      if (reactionCount === 0) {
        setUserSelectedReaction('');
      }
    }
  }, [postReactions, userSelectedReaction]);

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

  /**
   * @description Add reaction and close modal
   * @param {string} reaction - The reaction type to add
   */
  const handleReactionClick = async (reaction) => {
    try {
      console.log('Adding reaction from modal:', reaction);

      // Get current reaction status
      const reactionResponse = await postService.getSinglePostReactionByUsername(_id, profile?.username);
      console.log('Current reaction status:', reactionResponse.data.reactions);

      // Create a deep copy of the post WITHOUT media
      const updatedPost = PostUtils.preparePostWithoutMedia({
        _id,
        reactions: cloneDeep(postReactions || {})
      });

      const hasExistingReaction = Object.keys(reactionResponse.data.reactions).length > 0;
      const previousReaction = hasExistingReaction ? reactionResponse.data.reactions.type : '';
      const isSameReaction = previousReaction === reaction;

      console.log('Has existing reaction?', hasExistingReaction);
      console.log('Previous reaction:', previousReaction);
      console.log('Is same reaction?', isSameReaction);

      // Update UI immediately for better user experience
      if (!hasExistingReaction) {
        updatedPost.reactions[reaction] += 1;
        setUserSelectedReaction(reaction);
      } else if (isSameReaction) {
        if (updatedPost.reactions[previousReaction] > 0) {
          updatedPost.reactions[previousReaction] -= 1;
        }
        setUserSelectedReaction('');
      } else {
        if (updatedPost.reactions[previousReaction] > 0) {
          updatedPost.reactions[previousReaction] -= 1;
        }
        updatedPost.reactions[reaction] += 1;
        setUserSelectedReaction(reaction);
      }

      // Update Redux state - first remove any existing reactions for this post
      const filteredReactions = filter(userReactions, (item) => item?.postId !== _id);

      // Only add the new reaction if user is adding a reaction or changing from one to another
      let newReactionsArray = filteredReactions;
      if (!isSameReaction || !hasExistingReaction) {
        newReactionsArray = [
          ...filteredReactions,
          {
            avatarColor: profile?.avatarColor,
            createdAt: `${new Date()}`,
            postId: _id,
            profilePicture: profile?.profilePicture,
            username: profile?.username,
            type: reaction
          }
        ];
      }

      // Update Redux immediately
      dispatch(addReactions(newReactionsArray));
      dispatch(updatePostItem(updatedPost));

      // Make API call based on the scenario
      if (!hasExistingReaction || !isSameReaction) {
        try {
          // Use the simplified approach first for better reliability
          await postService.addReactionBasic(_id, reaction, post?.userId || profile._id);
          console.log('Successfully added reaction using simplified method');
        } catch (basicError) {
          console.error('Error with simplified reaction method:', basicError);

          // Fallback to the original method if the simplified one fails
          const reactionsData = {
            userTo: post?.userId || profile._id,
            postId: _id,
            type: reaction,
            postReactions: updatedPost.reactions,
            profilePicture: profile?.profilePicture,
            previousReaction: previousReaction
          };

          await postService.addReaction(reactionsData);
        }
      } else if (isSameReaction && previousReaction) {
        let retryCount = 0;
        const maxRetries = 2;
        let removeSuccess = false;

        while (retryCount < maxRetries && !removeSuccess) {
          try {
            console.log(`Attempting to remove reaction (attempt ${retryCount + 1}):`, {
              postId: _id,
              previousReaction
            });

            // Force UI update AGAIN before API call to ensure button shows as unselected
            setUserSelectedReaction('');

            await postService.removeReactionBasic(_id, previousReaction);
            console.log('Successfully removed reaction');
            removeSuccess = true;

            // Force UI update again after successful API call
            setUserSelectedReaction('');

            // Make sure no reactions exist for this post in Redux
            dispatch(addReactions(filteredReactions));
          } catch (removeError) {
            console.error(`Error removing reaction (attempt ${retryCount + 1}):`, removeError);
            retryCount++;

            if (retryCount >= maxRetries) {
              Utils.dispatchNotification(
                dispatch,
                'Unable to sync with server, but your reaction was removed locally. Please try again later.',
                'warning'
              );

              // Even though the server sync failed, keep the UI updated
              setUserSelectedReaction('');
            } else {
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
        }
      }

      // Send socket notification if we're connected
      if (socketService?.socket?.connected) {
        const socketReactionData = {
          userTo: post?.userId || profile._id,
          postId: _id,
          username: profile?.username,
          avatarColor: profile?.avatarColor,
          type: reaction,
          postReactions: updatedPost.reactions,
          profilePicture: profile?.profilePicture,
          previousReaction: previousReaction
        };
        socketService?.socket?.emit('reaction', socketReactionData);
      }

      // Close modal after adding reaction
      closeModal();
    } catch (error) {
      console.error('Error handling reaction:', error);
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error adding reaction', 'error');
    }
  };

  // Get reactions and set up socket listeners
  useEffect(() => {
    getPostReactions();
    getUserReaction();

    // Setup socket listeners for real-time updates
    if (_id) {
      socketService?.socket?.on('reaction', (data) => {
        if (data?.postId === _id) {
          // Refresh the reactions when a new one is added
          getPostReactions();
          getUserReaction();
        }
      });

      // Cleanup socket listeners on unmount
      return () => {
        socketService?.socket?.off('reaction');
      };
    }
  }, [getPostReactions, getUserReaction, _id]);

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

        <div className="reactions-modal-footer">
          <div className="add-reaction-section">
            <p>Add your reaction:</p>
            <div className="reactions-container">
              <Reactions handleClick={handleReactionClick} showLabel={true} currentReaction={userSelectedReaction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionsModal;
