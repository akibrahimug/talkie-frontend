import Avatar from '@components/avatar/Avatar';
import { reactionsMap, reactionsColor } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import { timeAgo } from '@services/utils/timeago.utils.service';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import '@components/posts/reactions/reactions-modal/reaction-list/ReactionList.scss';

const ReactionList = ({ postReactions }) => {
  const { _id: currentPostId } = useSelector((state) => state.post);

  // Filter reactions to ensure they belong to the current post and deduplicate by userId
  const validReactions = postReactions.reduce((uniqueReactions, reaction) => {
    // Skip if reaction doesn't match current post ID
    if (reaction.postId && currentPostId && reaction.postId !== currentPostId) {
      console.warn(`Filtered out reaction that doesn't match current post ID`, {
        reactionPostId: reaction.postId,
        currentPostId
      });
      return uniqueReactions;
    }

    // Check if we already have a reaction from this user
    const existingIndex = uniqueReactions.findIndex((item) => item.userId === reaction.userId);

    if (existingIndex === -1) {
      // If this user's reaction isn't in our list yet, add it
      return [...uniqueReactions, reaction];
    }

    // If we already have a reaction from this user but the new one is more recent, replace it
    if (new Date(reaction.createdAt) > new Date(uniqueReactions[existingIndex].createdAt)) {
      const updated = [...uniqueReactions];
      updated[existingIndex] = reaction;
      return updated;
    }

    return uniqueReactions;
  }, []);

  return (
    <div className="modal-reactions-container" data-testid="modal-reactions-container">
      {validReactions.map((reaction) => (
        <div
          className="modal-reactions-container-list"
          key={reaction.userId || reaction._id || Utils.generateString(10)}
          data-testid="reaction-list">
          <div className="img">
            <Avatar
              name={reaction?.username}
              bgColor={reaction?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={reaction?.profilePicture}
            />
            <div className="reaction-icon" style={{ color: reactionsColor[reaction?.type] }}>
              {reactionsMap[reaction?.type]}
            </div>
          </div>
          <div className="reaction-details">
            <span className="username">{reaction?.username}</span>
            {reaction?.createdAt && <span className="time">{timeAgo.transform(reaction?.createdAt)}</span>}
          </div>
        </div>
      ))}

      {validReactions.length === 0 && (
        <div className="no-reactions-found">
          <p>No reactions found for this post</p>
        </div>
      )}
    </div>
  );
};

ReactionList.propTypes = {
  postReactions: PropTypes.array
};

export default ReactionList;
