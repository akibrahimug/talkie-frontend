// import ReactionWrapper from '@components/posts/modal-wrappers/reaction-wrapper/reaction-wrapper';
import ReactionList from '@components/posts/reactions/reactions-modal/reaction-list/ReactionList';
// import useEffectOnce from '@hooks/useEffectOnce';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { reactionsColor, reactionsMap } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import { filter, orderBy, some } from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@components/icons';
import '@components/posts/reactions/reactions-modal/ReactionsModal.scss';

const ReactionsModal = () => {
  const { _id, reactions } = useSelector((state) => state.post);
  const [activeViewAllTab, setActiveViewAllTab] = useState(true);
  const [formattedReactions, setFormattedReactions] = useState([]);
  const [reactionType, setReactionType] = useState('');
  const [reactionColor, setReactionColor] = useState('');
  const [postReactions, setPostReactions] = useState([]);
  const [reactionsOfPost, setReactionsOfPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    if (!_id) {
      console.error('No post ID available for fetching reactions');
      setIsLoading(false);
      setError('Unable to load reactions: No post ID available');
      return;
    }

    console.log('Fetching reactions for post ID:', _id);
    setIsLoading(true);
    setError(null);

    try {
      const response = await postService.getPostReactions(_id);
      console.log('Reactions API response:', response.data);

      // Additional debugging to see duplicate reactions
      if (response.data?.reactions) {
        const userCounts = {};
        response.data.reactions.forEach((reaction) => {
          if (!userCounts[reaction.userId]) {
            userCounts[reaction.userId] = 0;
          }
          userCounts[reaction.userId]++;
        });

        // Log any users with multiple reactions
        const duplicateUsers = Object.entries(userCounts)
          .filter(([userId, count]) => count > 1)
          .map(([userId, count]) => {
            const userReactions = response.data.reactions.filter((r) => r.userId === userId);
            return { userId, count, reactions: userReactions };
          });

        if (duplicateUsers.length > 0) {
          console.warn('Found duplicate user reactions:', duplicateUsers);
        }
      }

      // Explicit check to ensure we only process responses for the current post ID
      if (response.data?.postId && response.data.postId !== _id) {
        console.error('Received reactions for wrong post ID', {
          expected: _id,
          received: response.data.postId
        });
        setError('Received reactions for a different post');
        setIsLoading(false);
        return;
      }

      // Additional filter to ensure we only show reactions for this post
      let filteredReactions = response.data?.reactions || [];
      if (filteredReactions.length > 0 && response.data?.reactions[0]?.postId) {
        filteredReactions = filter(filteredReactions, (reaction) => reaction.postId === _id);
        console.log('Filtered reactions to ensure only for this post:', filteredReactions.length);
      }

      // Deduplicate reactions by userId (keep only the most recent reaction from each user)
      const uniqueReactions = filteredReactions.reduce((acc, reaction) => {
        const existingIndex = acc.findIndex((r) => r.userId === reaction.userId);

        if (existingIndex === -1) {
          // If this is the first reaction from this user, add it
          return [...acc, reaction];
        }

        // If we have a reaction from this user already, keep the most recent one
        if (new Date(reaction.createdAt) > new Date(acc[existingIndex].createdAt)) {
          const updated = [...acc];
          updated[existingIndex] = reaction;
          return updated;
        }

        return acc;
      }, []);

      console.log('Reactions after deduplication:', uniqueReactions.length);

      const orderedPosts = orderBy(uniqueReactions, ['createdAt'], ['desc']);
      setPostReactions(orderedPosts);
      setReactionsOfPost(orderedPosts);
      setFormattedReactions(Utils.formattedReactions(reactions));
    } catch (error) {
      console.error('Error fetching reactions:', error);
      setError(error?.response?.data?.message || 'Error loading reactions');
      Utils.dispatchNotification(error?.response?.data?.message || 'Error loading reactions', 'error', dispatch);
    } finally {
      setIsLoading(false);
    }
  };

  const closeReactionsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  const viewAll = () => {
    setActiveViewAllTab(true);
    setReactionType('');
    setPostReactions(reactionsOfPost);
  };

  const reactionList = (type) => {
    setActiveViewAllTab(false);
    setReactionType(type);
    const exist = some(reactionsOfPost, (reaction) => reaction.type === type);
    const filteredReactions = exist ? filter(reactionsOfPost, (reaction) => reaction.type === type) : [];
    setPostReactions(filteredReactions);
    setReactionColor(reactionsColor[type]);
  };

  // Use regular useEffect instead of useEffectOnce for better dependency handling
  useEffect(() => {
    console.log('ReactionsModal effect triggered, post ID:', _id);
    getPostReactions();
  }, [_id]); // Re-fetch when post ID changes

  return (
    <div className="reactions-modal">
      <div className="reactions-modal-content">
        {/* Modal Header */}
        <div className="reactions-modal-header">
          <h2>People Who Reacted</h2>
          <button className="close-btn" onClick={closeReactionsModal}>
            <Icon name="X" weight="bold" />
          </button>
        </div>

        {/* Reaction Type Tabs */}
        <div className="modal-reactions-header-tabs">
          <ul className="modal-reactions-header-tabs-list">
            <li className={`${activeViewAllTab ? 'activeViewAllTab' : 'all'}`} onClick={viewAll}>
              All
            </li>
            {formattedReactions.map((reaction) => (
              <li
                key={Utils.generateString(10)}
                className={`${reaction.type === reactionType ? 'activeTab' : ''}`}
                style={{ color: `${reaction.type === reactionType ? reactionsColor[reaction.type] : ''}` }}
                onClick={() => reactionList(reaction?.type)}>
                {reactionsMap[reaction?.type]}
                <span>{Utils.shortenLargeNumbers(reaction?.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reactions List */}
        <div className="reactions-modal-body">
          {isLoading ? (
            <div className="loading-reactions">
              <Icon name="SpinnerGap" className="spinner" weight="regular" size="large" />
              <p>Loading reactions...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <Icon name="WarningCircle" weight="duotone" size="large" />
              <p>{error}</p>
            </div>
          ) : postReactions.length === 0 ? (
            <div className="no-reactions">
              <p>No reactions found for this post</p>
            </div>
          ) : (
            <ReactionList postReactions={postReactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionsModal;
