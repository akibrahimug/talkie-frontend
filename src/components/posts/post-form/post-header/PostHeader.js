import PropTypes from 'prop-types';
import './PostHeader.scss';

/**
 * @description Component for the post form header
 * @param {string} title - The header title
 * @returns {JSX} The PostHeader component
 */
const PostHeader = ({ title }) => {
  return (
    <div className="post-header">
      <h4 className="post-header-title">{title}</h4>
    </div>
  );
};

PostHeader.propTypes = {
  title: PropTypes.string.isRequired
};

PostHeader.defaultProps = {
  title: 'Create Post'
};

export default PostHeader;
