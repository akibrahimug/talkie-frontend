import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './ImageModal.scss';

/**
 * @description Modal component for displaying full-size images
 * @param {string} image - The image URL to display
 * @param {function} onCancel - Function to call when closing the modal
 * @param {boolean} showArrow - Whether to show navigation arrows
 * @returns {JSX} The ImageModal component
 */
const ImageModal = ({ image, onCancel, showArrow }) => {
  return (
    <div className="image-modal" data-testid="image-modal">
      <div className="image-modal-content">
        <div className="image-modal-close">
          <button className="close-button" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        <div className="image-modal-body">
          <img src={image} alt="Full size post" />
        </div>
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  image: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  showArrow: PropTypes.bool
};

ImageModal.defaultProps = {
  showArrow: false
};

export default ImageModal;
