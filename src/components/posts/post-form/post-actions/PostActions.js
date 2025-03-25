import PropTypes from 'prop-types';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import feeling from '@assets/images/feeling.png';
import video from '@assets/images/video.png';
import './PostActions.scss';
import SelectDropdown from '@components/select-dropdown/selectDropdown';

/**
 * @description Component for post form action buttons
 * @param {Object} refs - Object containing refs for file inputs
 * @param {boolean} isExpanded - Whether the form is expanded
 * @param {boolean} isSubmitDisabled - Whether the submit button is disabled
 * @param {function} onPhotoClick - Function to call when photo button is clicked
 * @param {function} onGifClick - Function to call when gif button is clicked
 * @param {function} onFeelingClick - Function to call when feeling button is clicked
 * @param {function} onVideoClick - Function to call when video button is clicked
 * @param {function} onPhotoChange - Function to call when a photo is selected
 * @param {function} onVideoChange - Function to call when a video is selected
 * @param {function} onSubmit - Function to call when the post is submitted
 * @param {Object} privacySetting - The current privacy setting object
 * @param {function} onPrivacyClick - Function to call when privacy button is clicked
 * @param {Object} privacyRef - Ref for the privacy dropdown
 * @param {boolean} togglePrivacy - Whether the privacy dropdown is visible
 * @param {Array} privacyList - List of privacy options
 * @param {function} setSelectedPrivacy - Function to set the selected privacy option
 * @returns {JSX} The PostActions component
 */
const PostActions = ({
  refs,
  isExpanded,
  isSubmitDisabled,
  onPhotoClick,
  onGifClick,
  onFeelingClick,
  onVideoClick,
  onPhotoChange,
  onVideoChange,
  onSubmit,
  privacySetting,
  onPrivacyClick,
  privacyRef,
  togglePrivacy,
  privacyList,
  setSelectedPrivacy
}) => {
  return (
    <div className="post-actions">
      <div className="post-actions-buttons">
        <button className="post-action-button" onClick={onPhotoClick}>
          <Input
            name="image"
            ref={refs.photoRef}
            type="file"
            className="file-input"
            accept="image/*"
            onClick={(e) => {
              e.stopPropagation();
              if (refs.photoRef.current) {
                refs.photoRef.current.value = null;
              }
            }}
            handleChange={onPhotoChange}
          />
          <img src={photo} alt="" /> Photo
        </button>
        <button className="post-action-button" onClick={onGifClick}>
          <img src={gif} alt="" /> Gif
        </button>
        <button className="post-action-button" onClick={onFeelingClick}>
          <img src={feeling} alt="" /> Feeling
        </button>
        <button className="post-action-button" onClick={onVideoClick}>
          <Input
            name="video"
            ref={refs.videoRef}
            type="file"
            className="file-input"
            accept="video/*"
            onClick={(e) => {
              e.stopPropagation();
              if (refs.videoRef.current) {
                refs.videoRef.current.value = null;
              }
            }}
            handleChange={onVideoChange}
          />
          <img src={video} alt="" /> Video
        </button>
      </div>

      {isExpanded && (
        <div className="post-footer-actions">
          <Button
            label="Post"
            className={`post-button ${isSubmitDisabled ? 'disabled' : ''}`}
            disabled={isSubmitDisabled}
            handleClick={onSubmit}
            testId="post-button"
          />
        </div>
      )}
    </div>
  );
};

PostActions.propTypes = {
  refs: PropTypes.shape({
    photoRef: PropTypes.object.isRequired,
    videoRef: PropTypes.object.isRequired
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  onPhotoClick: PropTypes.func.isRequired,
  onGifClick: PropTypes.func.isRequired,
  onFeelingClick: PropTypes.func.isRequired,
  onVideoClick: PropTypes.func.isRequired,
  onPhotoChange: PropTypes.func.isRequired,
  onVideoChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  privacySetting: PropTypes.object,
  onPrivacyClick: PropTypes.func,
  privacyRef: PropTypes.object,
  togglePrivacy: PropTypes.bool,
  privacyList: PropTypes.array,
  setSelectedPrivacy: PropTypes.func
};

export default PostActions;
