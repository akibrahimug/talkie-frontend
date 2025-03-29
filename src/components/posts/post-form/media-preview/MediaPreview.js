import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './MediaPreview.scss';

/**
 * @description Component for previewing media (images, videos, or GIFs) in the post form
 * @param {string} mediaUrl - The URL of the media to preview
 * @param {boolean} isVideo - Whether the media is a video
 * @param {boolean} isGif - Whether the media is a GIF
 * @param {function} onRemove - Function to call when the media is removed
 * @returns {JSX} The MediaPreview component
 */
const MediaPreview = ({ mediaUrl, isVideo, isGif, onRemove }) => {
  if (!mediaUrl) return null;

  return (
    <div className="media-preview">
      <div className="media-delete-btn" onClick={onRemove}>
        <FaTimes />
      </div>

      {isVideo ? (
        <div className="media-video-container">
          <video width="100%" controls src={mediaUrl}></video>
        </div>
      ) : (
        <img
          className={`media-image ${isGif ? 'gif-image' : ''}`}
          src={mediaUrl}
          alt={isGif ? 'GIF preview' : 'Post preview'}
        />
      )}

      {isGif && <div className="gif-indicator">GIF</div>}
    </div>
  );
};

MediaPreview.propTypes = {
  mediaUrl: PropTypes.string,
  isVideo: PropTypes.bool,
  isGif: PropTypes.bool,
  onRemove: PropTypes.func.isRequired
};

MediaPreview.defaultProps = {
  isVideo: false,
  isGif: false
};

export default MediaPreview;
