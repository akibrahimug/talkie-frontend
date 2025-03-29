import PropTypes from 'prop-types';
import '@components/posts/reactions/reactions-and-comments-display/reactionsAndCommentsDisplay.scss';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef, useCallback } from 'react';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { toggleReactionsModal } from '@redux/reducers/modal/modal.reducer';
import ExpandableComments from '@components/posts/expandable-comments/ExpandableComments';
import Reactions from '@components/posts/reactions/reactions';
import { cloneDeep, filter, find } from 'lodash';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { socketService } from '@services/sockets/socket.service';
import Icon from '@components/icons';
import { PostUtils } from '@services/utils/post.utils.service';

/**
 * @description Displays the reactions and comments for a post
 * @param {Object} post - The post object
 * @returns {JSX} The reactions and comments display component
 */
const ReactionsAndCommentsDisplay = ({ post: initialPost }) => {
  const { reactionsModalIsOpen } = useSelector((state) => state.modal);
  const { profile } = useSelector((state) => state.user);
  let { reactions: userReactions = [] } = useSelector((state) => state.userPostReactions || { reactions: [] });
  const [post, setPost] = useState(initialPost);
  const [postReactions, setPostReactions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [postCommentNames] = useState([]);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);
  const [isLoadingComments] = useState(false);
  const [hasLoadedReactions, setHasLoadedReactions] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [userSelectedReaction, setUserSelectedReaction] = useState('');
  const reactionsTimeoutRef = useRef(null);
  const commentsTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);

  // Update local post state when initialPost changes
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  /**
   * @description Fetches the reactions for a post
   * @returns {void}
   */
  const getPostReactions = useCallback(async () => {
    if (hasLoadedReactions || isLoadingReactions) return;

    setIsLoadingReactions(true);
    try {
      const response = await postService.getPostReactions(post?._id);
      setPostReactions(response.data.reactions);
      setHasLoadedReactions(true);
    } catch (error) {
      console.log('Error fetching reactions:', error?.response?.data?.message || error.message);
    } finally {
      setIsLoadingReactions(false);
    }
  }, [post?._id, hasLoadedReactions, isLoadingReactions]);

  /**
   * @description Gets the user's reaction to this post
   */
  const getUserReaction = useCallback(async () => {
    try {
      const response = await postService.getSinglePostReactionByUsername(post._id, profile?.username);
      const userReaction = response?.data?.reactions;

      // Only set a reaction if the user has one, otherwise leave it blank
      if (userReaction && Object.keys(userReaction).length > 0) {
        setUserSelectedReaction(userReaction.type);
      } else {
        // Reset to empty if no reaction found
        setUserSelectedReaction('');
      }
    } catch (error) {
      console.error('Error getting user reaction:', error);
      setUserSelectedReaction('');
    }
  }, [post._id, profile?.username]);

  /**
   * @description Delayed fetch for reactions on hover
   * @returns {void}
   */
  const handleReactionsHover = () => {
    if (reactionsTimeoutRef.current) clearTimeout(reactionsTimeoutRef.current);
    reactionsTimeoutRef.current = setTimeout(() => {
      getPostReactions();
    }, 300);
  };

  /**
   * @description Sums all the reactions
   * @param {Array} reactions - The reactions array
   * @returns {string} The sum of the reactions
   */
  const sumAllReactions = useCallback((reactions) => {
    if (reactions?.length) {
      const result = reactions.map((item) => item.value).reduce((prev, next) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
    return '0';
  }, []);

  /**
   * @description Opens the reactions component
   * @returns {void}
   */
  const openReactionsComponent = () => {
    // Use the utility function to prepare the post without media
    const postWithoutMedia = PostUtils.preparePostWithoutMedia(post);
    dispatch(updatePostItem(postWithoutMedia));
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  /**
   * @description Toggles the expandable comments section
   * @returns {void}
   */
  const toggleCommentsSection = () => {
    setCommentsExpanded(!commentsExpanded);
    if (!commentsExpanded) {
      // Use the utility function to prepare the post without media
      const postWithoutMedia = PostUtils.preparePostWithoutMedia(post);
      dispatch(updatePostItem(postWithoutMedia));
    }
  };

  /**
   * @description Handle showing reactions menu
   */
  const handleShowReactionsMenu = () => {
    setShowReactionsMenu(true);
  };

  /**
   * @description Handle hiding reactions menu
   */
  const handleHideReactionsMenu = () => {
    setShowReactionsMenu(false);
  };

  /**
   * @description Handle reaction button click
   */
  const handleReactionButtonClick = () => {
    // Only toggle off an existing reaction
    if (userSelectedReaction) {
      addReactionPost(userSelectedReaction);
    }
    // Do nothing if no reaction - user must select a specific reaction
  };

  /**
   * @description Add reaction to post
   * @param {string} reaction - The reaction type
   * @returns {Promise<void>}
   */
  const addReactionPost = async (reaction) => {
    try {
      console.log('Adding reaction from ReactionsAndCommentsDisplay:', reaction);

      // Get current reaction status
      const reactionResponse = await postService.getSinglePostReactionByUsername(post._id, profile?.username);
      console.log('Current reaction status:', reactionResponse.data.reactions);

      // Create a deep copy of the post
      const updatedPost = PostUtils.preparePostWithoutMedia({
        _id: post._id,
        reactions: cloneDeep(post.reactions || {})
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
        setUserSelectedReaction(''); // Clear current reaction
      } else {
        if (updatedPost.reactions[previousReaction] > 0) {
          updatedPost.reactions[previousReaction] -= 1;
        }
        updatedPost.reactions[reaction] += 1;
        setUserSelectedReaction(reaction);
      }

      // Update the post state with the reaction
      setPost({ ...post, reactions: updatedPost.reactions });

      // Update Redux state - first remove any existing reactions for this post
      const filteredReactions = filter(userReactions, (item) => item?.postId !== post._id);

      // Only add the new reaction if user is adding a reaction or changing from one to another
      let newReactionsArray = filteredReactions;
      if (!isSameReaction || !hasExistingReaction) {
        newReactionsArray = [
          ...filteredReactions,
          {
            avatarColor: profile?.avatarColor,
            createdAt: `${new Date()}`,
            postId: post._id,
            profilePicture: profile?.profilePicture,
            username: profile?.username,
            type: reaction
          }
        ];
      }

      // Update Redux immediately
      dispatch(addReactions(newReactionsArray));

      // Make API call based on the scenario
      if (!hasExistingReaction || !isSameReaction) {
        try {
          // Use the simplified approach first for better reliability
          await postService.addReactionBasic(post._id, reaction, post?.userId);
          console.log('Successfully added reaction using simplified method');
        } catch (basicError) {
          console.error('Error with simplified reaction method:', basicError);

          // Fallback to the original method if the simplified one fails
          const reactionsData = {
            userTo: post?.userId,
            postId: post._id,
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
              postId: post._id,
              previousReaction
            });

            // Force UI update AGAIN before API call to ensure button shows as unselected
            setUserSelectedReaction('');

            await postService.removeReactionBasic(post._id, previousReaction);
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

      // Send socket notification
      if (socketService?.socket?.connected) {
        const socketReactionData = {
          userTo: post?.userId,
          postId: post._id,
          username: profile?.username,
          avatarColor: profile?.avatarColor,
          type: reaction,
          postReactions: updatedPost.reactions,
          profilePicture: profile?.profilePicture,
          previousReaction: previousReaction
        };
        socketService?.socket?.emit('reaction', socketReactionData);
      }

      // Hide the reactions menu
      handleHideReactionsMenu();
    } catch (error) {
      console.error('Error adding reaction:', error);
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error handling reaction', 'error');
    }
  };

  /**
   * @description Formats the reactions
   * @returns {void}
   */
  useEffect(() => {
    setReactions(Utils.formattedReactions(post?.reactions));

    // Check if there are any reactions of the user's selected type
    // If not, reset the button state to unselected
    if (userSelectedReaction && post?.reactions) {
      const reactionCount = post.reactions[userSelectedReaction] || 0;
      if (reactionCount === 0) {
        setUserSelectedReaction('');
      }
    }

    // Fix for stale ref issue - store refs in local variables
    const reactionsTimeout = reactionsTimeoutRef.current;
    const commentsTimeout = commentsTimeoutRef.current;

    // Clear timeout refs on unmount
    return () => {
      if (reactionsTimeout) clearTimeout(reactionsTimeout);
      if (commentsTimeout) clearTimeout(commentsTimeout);
    };
  }, [post, userSelectedReaction]);

  /**
   * @description Setup socket listeners for real-time updates
   * @returns {void}
   */
  useEffect(() => {
    if (!post?._id) return;

    // Create a reference to the current post to use in cleanup
    const currentPostId = post._id;

    // Handle reaction updates
    const handleReactionUpdate = (data) => {
      if (data?.postId === currentPostId) {
        // Update post reactions in real time
        const updatedPost = { ...post, reactions: data.postReactions };
        setPost(updatedPost);
        setReactions(Utils.formattedReactions(data.postReactions));

        // Also refresh the user's selected reaction
        getUserReaction();
      }
    };

    // Handle comment updates - use 'Update comment' to match backend event name
    const handleCommentUpdate = (data) => {
      if (data?.postId === currentPostId) {
        // Update post comments count in real time
        const updatedPost = { ...post, commentsCount: data.commentsCount };
        setPost(updatedPost);

        // Also update in Redux
        dispatch(updatePostItem(updatedPost));
      }
    };

    socketService?.socket?.on('reaction', handleReactionUpdate);
    socketService?.socket?.on('Update comment', handleCommentUpdate);

    // Cleanup socket listeners on unmount
    return () => {
      socketService?.socket?.off('reaction', handleReactionUpdate);
      socketService?.socket?.off('Update comment', handleCommentUpdate);
    };
  }, [post, getUserReaction, dispatch]);

  /**
   * @description Call getUserReaction when the component mounts or when the post changes
   */
  useEffect(() => {
    if (post?._id && profile?.username) {
      getUserReaction();
    }
  }, [post?._id, profile?.username, getUserReaction, post?.reactions]);

  /**
   * @description Renders the reaction icons
   * @returns {JSX}
   */
  const renderReactionIcons = () => {
    // Take only the top 3 reactions to display in a stacked format
    return reactions.length > 0
      ? reactions.slice(0, 3).map((reaction) => (
          <div className="tooltip-container" key={reaction?.type}>
            <div data-testid="reaction-img" className="reaction-img">
              {reactionsMap[reaction?.type]}
            </div>
          </div>
        ))
      : null;
  };

  /**
   * @description Renders the reaction button text and icon
   * @returns {JSX}
   */
  const renderReactionButtonContent = () => {
    // Ensure the button shows "Like" if the user's selected reaction count is 0
    if (!userSelectedReaction || (post?.reactions && post.reactions[userSelectedReaction] === 0)) {
      return (
        <>
          <span className="reaction-button-icon">
            <Icon name="ThumbsUp" className="reaction-icon" weight="regular" />
          </span>
          <span>Like</span>
        </>
      );
    }

    return (
      <>
        <span className="reaction-button-icon">{reactionsMap[userSelectedReaction]}</span>
        <span>{Utils.firstLetterUpperCase(userSelectedReaction)}</span>
      </>
    );
  };

  return (
    <div className="reactions-display">
      <div className="reaction-comments-container">
        {/* Reactions summary - shows the count and icons */}
        <div className="reactions-summary" onClick={openReactionsComponent}>
          <div className="reactions-icons">{renderReactionIcons()}</div>
          <span className="reactions-count">{sumAllReactions(reactions)}</span>
        </div>

        {/* Facebook-style reaction buttons */}
        <div className="reaction-buttons-container">
          {/* Like/React button */}
          <div
            className={`reaction-button ${userSelectedReaction ? `selected-${userSelectedReaction}` : ''}`}
            onMouseEnter={handleShowReactionsMenu}
            onMouseLeave={handleHideReactionsMenu}
            onClick={handleReactionButtonClick}>
            {renderReactionButtonContent()}

            {/* Reactions hover menu */}
            {showReactionsMenu && (
              <div className="reactions-menu">
                <Reactions handleClick={addReactionPost} showLabel={true} currentReaction={userSelectedReaction} />
              </div>
            )}
          </div>

          {/* Comment button */}
          <div className="reaction-button" onClick={toggleCommentsSection}>
            <span className="reaction-button-icon">
              <Icon name="ChatTeardrop" className="comment-icon" weight="regular" />
            </span>
            <span>Comment</span>
          </div>
        </div>
      </div>

      <ExpandableComments post={post} isExpanded={commentsExpanded} onToggle={toggleCommentsSection} />
    </div>
  );
};

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object
};

export default ReactionsAndCommentsDisplay;
