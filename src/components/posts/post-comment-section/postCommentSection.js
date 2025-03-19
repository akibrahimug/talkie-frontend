import CommentArea from '@components/posts/comment-area/commentArea';
import ReactionsAndCommentsDisplay from '@components/posts/reactions/reactions-and-comments-display/reactionsAndCommentsDisplay';
import PropTypes from 'prop-types';

const PostCommentSection = ({ post }) => {
  return (
    <div data-testid="comment-section">
      <ReactionsAndCommentsDisplay post={post} />
      <CommentArea post={post} />
    </div>
  );
};

PostCommentSection.propTypes = {
  post: PropTypes.object
};

export default PostCommentSection;
