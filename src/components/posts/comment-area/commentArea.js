import PropTypes from 'prop-types';
import { FaRegCommentAlt } from 'react-icons/fa';
import '@components/posts/comment-area/commentArea.scss';
import Reactions from '@components/posts/reactions/reactions';
import { useCallback, useEffect, useState } from 'react';
import { cloneDeep, filter, find } from 'lodash';
import { Utils } from '@services/utils/utils.service';
import { reactionsMap } from '@services/utils/static.data';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { socketService } from '@services/sockets/socket.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';

/**
 * Comment area component.
 * @param {object} post - The post object.
 * @returns {JSX.Element} - The CommentArea component.
 */
const CommentArea = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  let { reactions = [] } = useSelector((state) => state.userPostReactions || { reactions: [] });
  const [userSelectedReaction, setUserSelectedReaction] = useState('like');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const [setSelectedPostId] = useLocalStorage('selectedPostId', 'set');
  const dispatch = useDispatch();

  /**
   * Selected user reaction.
   */
  const selectedUserReaction = useCallback(
    (postReactions) => {
      const userReaction = find(postReactions, (reaction) => reaction.postId === post._id);
      const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : 'Like';
      setUserSelectedReaction(result);
    },
    [post]
  );

  /**
   * Toggle comment input.
   */
  const toggleCommentInput = () => {
    if (!selectedPostId) {
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    } else {
      removeSelectedPostId();
    }
  };

  /**
   * Remove selected post id.
   */
  const removeSelectedPostId = () => {
    if (selectedPostId === post?._id) {
      setSelectedPostId('');
      dispatch(clearPost());
    } else {
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    }
  };

  /**
   * Add reaction to post.
   * @param {string} reaction - The reaction to add.
   */
  const addReactionPost = async (reaction) => {
    try {
      const reactionResponse = await postService.getSinglePostReactionByUsername(post?._id, profile?.username);
      post = updatePostReactions(
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      /**
       * Add new reaction.
       */
      const postReactions = addNewReaction(
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );
      reactions = [...postReactions];
      dispatch(addReactions(reactions));

      /**
       * Send socket IO reaction.
       */
      sendSocketIOReactions(
        post,
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      /**
       * Reactions data.
       */
      const reactionsData = {
        userTo: post?.userId,
        postId: post?._id,
        type: reaction,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture,
        previousReaction: Object.keys(reactionResponse.data.reactions).length
          ? reactionResponse.data.reactions?.type
          : ''
      };

      if (!Object.keys(reactionResponse.data.reactions).length) {
        await postService.addReaction(reactionsData);
      } else {
        reactionsData.previousReaction = reactionResponse.data.reactions?.type;
        if (reaction === reactionsData.previousReaction) {
          await postService.removeReaction(post?._id, reactionsData.previousReaction, post.reactions);
        } else {
          await postService.addReaction(reactionsData);
        }
      }
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const updatePostReactions = (newReaction, hasResponse, previousReaction) => {
    post = cloneDeep(post);
    if (!hasResponse) {
      post.reactions[newReaction] += 1;
    } else {
      if (post.reactions[previousReaction] > 0) {
        post.reactions[previousReaction] -= 1;
      }
      if (previousReaction !== newReaction) {
        post.reactions[newReaction] += 1;
      }
    }
    return post;
  };

  const addNewReaction = (newReaction, hasResponse, previousReaction) => {
    const postReactions = filter(reactions, (reaction) => reaction?.postId !== post?._id);
    const newPostReaction = {
      avatarColor: profile?.avatarColor,
      createdAt: `${new Date()}`,
      postId: post?._id,
      profilePicture: profile?.profilePicture,
      username: profile?.username,
      type: newReaction
    };
    if (hasResponse && previousReaction !== newReaction) {
      postReactions.push(newPostReaction);
    } else if (!hasResponse) {
      postReactions.push(newPostReaction);
    }
    return postReactions;
  };

  const sendSocketIOReactions = (post, reaction, hasResponse, previousReaction) => {
    const socketReactionData = {
      userTo: post.userId,
      postId: post._id,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      type: reaction,
      postReactions: post.reactions,
      profilePicture: profile?.profilePicture,
      previousReaction: hasResponse ? previousReaction : ''
    };
    socketService?.socket?.emit('reaction', socketReactionData);
  };

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);

  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block" onClick={() => addReactionPost('like')}>
          <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
            <div className={`reaction-display ${userSelectedReaction.toLowerCase()} `} data-testid="selected-reaction">
              <img className="reaction-img" src={reactionsMap[userSelectedReaction.toLowerCase()]} alt="" />
              <span>{userSelectedReaction}</span>
            </div>
          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions handleClick={addReactionPost} />
        </div>
      </div>
      <div className="comment-block" onClick={toggleCommentInput}>
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
    </div>
  );
};

CommentArea.propTypes = {
  post: PropTypes.object
};

export default CommentArea;
