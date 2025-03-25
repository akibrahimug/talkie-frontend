import PropTypes from 'prop-types';
import '@components/posts/reactions/reactions-and-comments-display/reactionsAndCommentsDisplay.scss';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef, useCallback } from 'react';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { toggleReactionsModal, toggleCommentsModal } from '@redux/reducers/modal/modal.reducer';
import ExpandableComments from '@components/posts/expandable-comments/ExpandableComments';
import Reactions from '@components/posts/reactions/reactions';
import { cloneDeep, filter, find } from 'lodash';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { socketService } from '@services/sockets/socket.service';
import Icon from '@components/icons';

/**
 * @description Displays the reactions and comments for a post
 * @param {Object} post - The post object
 * @returns {JSX} The reactions and comments display component
 */
const ReactionsAndCommentsDisplay = ({ post: initialPost }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen } = useSelector((state) => state.modal);
  const { profile } = useSelector((state) => state.user);
  let { reactions: userReactions = [] } = useSelector((state) => state.userPostReactions || { reactions: [] });
  const [post, setPost] = useState(initialPost);
  const [postReactions, setPostReactions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [postCommentNames, setPostCommentNames] = useState([]);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasLoadedReactions, setHasLoadedReactions] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [userSelectedReaction, setUserSelectedReaction] = useState('like');
  const reactionsTimeoutRef = useRef(null);
  const commentsTimeoutRef = useRef(null);
  const dispatch = useDispatch();

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
   * @description Fetch the current user's reaction for this post
   * @returns {void}
   */
  const fetchUserReactionForPost = useCallback(async () => {
    if (!post?._id || !profile?.username) return;

    try {
      const response = await postService.getSinglePostReactionByUsername(post._id, profile.username);

      if (response && response.data && Object.keys(response.data.reactions).length > 0) {
        const userReaction = response.data.reactions.type;
        console.log('Fetched user reaction:', userReaction);
        setUserSelectedReaction(Utils.firstLetterUpperCase(userReaction));

        // Update Redux store with this reaction if needed
        const existingReaction = find(userReactions, (reaction) => reaction.postId === post._id);

        if (!existingReaction) {
          const updatedReactions = [
            ...userReactions,
            {
              avatarColor: profile.avatarColor || '',
              createdAt: response.data.reactions.createdAt || new Date().toISOString(),
              postId: post._id,
              profilePicture: profile.profilePicture || '',
              username: profile.username,
              type: userReaction
            }
          ];

          dispatch(addReactions(updatedReactions));
        }
      }
    } catch (error) {
      console.log('Error fetching user reaction:', error?.response?.data?.message || error.message);
    }
  }, [post?._id, profile?.username, profile?.avatarColor, profile?.profilePicture, userReactions, dispatch]);

  /**
   * @description Fetches the comments names for a post
   * @returns {void}
   */
  const getPostCommentsNames = useCallback(async () => {
    if (hasLoadedComments || isLoadingComments) return;

    setIsLoadingComments(true);
    try {
      const response = await postService.getPostCommentsNames(post?._id);
      setPostCommentNames([...new Set(response.data.comments.names)]);
      setHasLoadedComments(true);
    } catch (error) {
      console.log('Error fetching comment names:', error?.response?.data?.message || error.message);
    } finally {
      setIsLoadingComments(false);
    }
  }, [post?._id, hasLoadedComments, isLoadingComments]);

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
   * @description Delayed fetch for comments on hover
   * @returns {void}
   */
  const handleCommentsHover = () => {
    if (commentsTimeoutRef.current) clearTimeout(commentsTimeoutRef.current);
    commentsTimeoutRef.current = setTimeout(() => {
      getPostCommentsNames();
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
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  /**
   * @description Opens the comments modal
   * @returns {void}
   */
  const openCommentsModal = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(true));
  };

  /**
   * @description Toggles the expandable comments section
   * @returns {void}
   */
  const toggleCommentsSection = () => {
    setCommentsExpanded(!commentsExpanded);
    if (!commentsExpanded) {
      dispatch(updatePostItem(post));
    }
  };

  /**
   * @description Add reaction to post.
   * @param {string} reaction - The reaction to add.
   */
  const addReactionPost = async (reaction) => {
    try {
      // 1. First get the current reaction status
      const reactionResponse = await postService.getSinglePostReactionByUsername(post?._id, profile?.username);

      // 2. Create a deep copy of the post to update
      const updatedPost = cloneDeep(post);

      // Store original reaction counts to revert in case of error
      const originalReactions = cloneDeep(post.reactions);

      const hasExistingReaction = Object.keys(reactionResponse.data.reactions).length > 0;
      const previousReaction = hasExistingReaction ? reactionResponse.data.reactions.type : '';
      const isSameReaction = previousReaction === reaction;

      // 4. Update post reaction counts
      if (!hasExistingReaction) {
        // No previous reaction, increment the new reaction count
        updatedPost.reactions[reaction] += 1;
      } else if (isSameReaction) {
        // Same reaction, decrement to remove it
        if (updatedPost.reactions[previousReaction] > 0) {
          updatedPost.reactions[previousReaction] -= 1;
        }
      } else {
        // Different reaction, decrement previous and increment new
        if (updatedPost.reactions[previousReaction] > 0) {
          updatedPost.reactions[previousReaction] -= 1;
        }
        updatedPost.reactions[reaction] += 1;
      }

      // 3. Prepare the reactions data for API call - IMPORTANT: Make sure all fields have proper values
      const reactionsData = {
        userTo: post?.userId || '',
        postId: post?._id || '',
        type: reaction || 'like', // Default to 'like' if reaction is undefined
        postReactions: updatedPost.reactions || {},
        profilePicture: profile?.profilePicture || '',
        previousReaction: previousReaction || ''
      };

      // 5. Make the database API calls with proper error handling
      let dbUpdateSuccessful = false;

      try {
        if (!hasExistingReaction) {
          // Add new reaction
          const response = await postService.addReaction(reactionsData);
          dbUpdateSuccessful = response && response.status === 200;
        } else if (isSameReaction) {
          // Remove existing reaction
          const response = await postService.removeReaction(post?._id, previousReaction, updatedPost.reactions);
          dbUpdateSuccessful = response && response.status === 200;
        } else {
          // Change reaction
          const response = await postService.addReaction(reactionsData);
          dbUpdateSuccessful = response && response.status === 200;
        }
      } catch (dbError) {
        console.error('Database error when updating reaction:', dbError?.response?.data?.message || dbError.message);
        // Show error visually
        alert('There was an error saving your reaction. Please try again.');
        return; // Exit early
      }

      // Only update UI if database update was successful
      if (dbUpdateSuccessful) {
        console.log('Reaction saved successfully');

        // 6. Update local state and UI
        setPost(updatedPost);
        setReactions(Utils.formattedReactions(updatedPost.reactions));

        // 7. Update selected reaction display
        if (isSameReaction && hasExistingReaction) {
          setUserSelectedReaction('Like');
        } else {
          setUserSelectedReaction(Utils.firstLetterUpperCase(reaction));
        }

        // 8. Update Redux state
        // Create new reactions array for user reactions in Redux
        const postReactions = filter(userReactions, (item) => item?.postId !== post?._id);

        if (!isSameReaction || !hasExistingReaction) {
          postReactions.push({
            avatarColor: profile?.avatarColor || '',
            createdAt: `${new Date()}`,
            postId: post?._id || '',
            profilePicture: profile?.profilePicture || '',
            username: profile?.username || '',
            type: reaction || 'like'
          });
        }

        // Update Redux state with new reactions
        dispatch(addReactions([...postReactions]));

        // 9. Update the post in Redux
        dispatch(updatePostItem(updatedPost));

        // 10. Send socket notification
        const socketReactionData = {
          userTo: post?.userId || '',
          postId: post?._id || '',
          username: profile?.username || '',
          avatarColor: profile?.avatarColor || '',
          type: reaction || 'like',
          postReactions: updatedPost.reactions || {},
          profilePicture: profile?.profilePicture || '',
          previousReaction: previousReaction || ''
        };
        socketService?.socket?.emit('reaction', socketReactionData);
      } else {
        console.log('Database update for reaction failed.');
        // Revert to original reaction counts if DB update failed
        setPost({ ...post, reactions: originalReactions });
        setReactions(Utils.formattedReactions(originalReactions));
      }
    } catch (error) {
      console.error('Error handling reaction:', error?.response?.data?.message || error.message);
      alert('Something went wrong when adding your reaction. Please try again.');
    }
  };

  /**
   * @description Selected user reaction
   */
  const selectedUserReaction = useCallback(() => {
    const userReaction = find(userReactions, (reaction) => reaction.postId === post?._id);
    const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : 'Like';
    setUserSelectedReaction(result);
  }, [post?._id, userReactions]);

  /**
   * @description Formats the reactions
   * @returns {void}
   */
  useEffect(() => {
    setReactions(Utils.formattedReactions(post?.reactions));

    // Clear timeout refs on unmount
    return () => {
      if (reactionsTimeoutRef.current) clearTimeout(reactionsTimeoutRef.current);
      if (commentsTimeoutRef.current) clearTimeout(commentsTimeoutRef.current);
    };
  }, [post]);

  /**
   * @description Setup socket listeners for real-time updates
   * @returns {void}
   */
  useEffect(() => {
    if (post?._id) {
      socketService?.socket?.on('reaction', (data) => {
        if (data?.postId === post?._id) {
          // Update post reactions in real time
          const updatedPost = { ...post, reactions: data.postReactions };
          setPost(updatedPost);
          setReactions(Utils.formattedReactions(data.postReactions));
        }
      });

      // Cleanup socket listeners on unmount
      return () => {
        socketService?.socket?.off('reaction');
      };
    }
  }, [post?._id]);

  /**
   * @description Fetch user's reaction when component mounts or post changes
   */
  useEffect(() => {
    if (post?._id) {
      fetchUserReactionForPost();
    }
  }, [post?._id, fetchUserReactionForPost]);

  /**
   * @description Update selected user reaction when user reactions change
   */
  useEffect(() => {
    selectedUserReaction();
  }, [selectedUserReaction, userReactions]);

  /**
   * @description Renders the reaction icons
   * @returns {JSX}
   */
  const renderReactionIcons = () => {
    return reactions.length > 0
      ? reactions.map((reaction) => (
          <div className="tooltip-container" key={reaction?.type}>
            <div data-testid="reaction-img" className="reaction-img" onMouseEnter={handleReactionsHover}>
              {reactionsMap[reaction?.type]}
            </div>
            <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
              <p className="title">
                <div className="title-icon">{reactionsMap[reaction?.type]}</div>
                {reaction?.type.toUpperCase()}
              </p>
              <div className="likes-block-icons-list">{renderReactionsTooltipContent(reaction)}</div>
            </div>
          </div>
        ))
      : null;
  };

  /**
   * @description Renders the tooltip content for reactions
   * @param {Object} reaction - The reaction object
   * @returns {JSX}
   */
  const renderReactionsTooltipContent = (reaction) => {
    if (isLoadingReactions) {
      return (
        <div className="loading-spinner">
          <Icon name="SpinnerGap" className="circle-notch" />
        </div>
      );
    }

    if (postReactions.length === 0) {
      return <span className="no-reactions">No reactions yet</span>;
    }

    return (
      <>
        {postReactions.slice(0, 19).map((postReaction) => (
          <div key={Utils.generateString(10)}>
            {postReaction?.type === reaction?.type && <span key={postReaction?._id}>{postReaction?.username}</span>}
          </div>
        ))}
        {postReactions.length > 20 && <span className="more-reactions">and {postReactions.length - 20} others...</span>}
      </>
    );
  };

  /**
   * @description Renders the comments tooltip content
   * @returns {JSX}
   */
  const renderCommentsTooltipContent = () => {
    if (isLoadingComments) {
      return (
        <div className="loading-spinner">
          <Icon name="SpinnerGap" className="circle-notch" />
        </div>
      );
    }

    if (postCommentNames.length === 0) {
      return <span className="no-comments">No comments yet</span>;
    }

    return (
      <>
        {postCommentNames.slice(0, 19).map((name) => (
          <span key={Utils.generateString(10)}>{name}</span>
        ))}
        {postCommentNames.length > 20 && (
          <span className="more-comments">and {postCommentNames.length - 20} others...</span>
        )}
      </>
    );
  };

  // Socket.IO listener for real-time updates
  useEffect(() => {
    if (post?._id) {
      socketService.socket.on('reaction', (data) => {
        if (data.postId === post._id) {
          console.log('Socket reaction update received:', data);
          // Refresh reactions without triggering flickering
          getPostReactions();

          // Update user's reaction if this is their reaction
          if (data.username === profile?.username) {
            setUserSelectedReaction(Utils.firstLetterUpperCase(data.type));
          }
        }
      });

      return () => {
        socketService.socket.off('reaction');
      };
    }
  }, [post?._id, profile?.username]);

  // Fetch user's reaction for this post
  useEffect(() => {
    fetchUserReactionForPost();
  }, [post?._id, fetchUserReactionForPost]);

  return (
    <div className="reactions-display">
      <div className="reaction-comments-container">
        <div className="reaction">
          <div className="reactions-popup">
            <div className="likes-block" onClick={() => addReactionPost(userSelectedReaction.toLowerCase())}>
              <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
                <div
                  className={`reaction-display ${userSelectedReaction.toLowerCase()} `}
                  data-testid="selected-reaction">
                  <div className="reaction-img">{reactionsMap[userSelectedReaction.toLowerCase()]}</div>
                  <span>{userSelectedReaction}</span>
                </div>
              </div>
            </div>
            <div className="reactions-container app-reactions">
              <Reactions handleClick={addReactionPost} />
            </div>
          </div>
        </div>
        <div className="comment" data-testid="comment-container" onClick={toggleCommentsSection}>
          <span className="comments-text">
            <Icon name="ChatTeardrop" className="comment-alt" weight="regular" />
            <span>
              {post?.commentsCount > 0
                ? `${Utils.shortenLargeNumbers(post?.commentsCount)} ${
                    post?.commentsCount === 1 ? 'Comment' : 'Comments'
                  }`
                : 'Add Comment'}
            </span>
          </span>
        </div>

        {post?.reactions.length > 0 && (
          <div className="reactions-summary" onClick={openReactionsComponent}>
            <div className="reactions-icons">{renderReactionIcons()}</div>
            <span className="reactions-count">{sumAllReactions(reactions)}</span>
          </div>
        )}

        {post?.commentsCount > 0 && (
          <div className="comments-summary" onClick={openCommentsModal}>
            <span className="view-comments">View all {post.commentsCount} comments</span>
          </div>
        )}
      </div>

      <ExpandableComments post={post} isExpanded={commentsExpanded} onToggle={toggleCommentsSection} />
    </div>
  );
};

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object
};

export default ReactionsAndCommentsDisplay;
