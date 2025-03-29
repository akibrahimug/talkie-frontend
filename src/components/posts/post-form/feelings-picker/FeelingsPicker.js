import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './FeelingsPicker.scss';

/**
 * @description Component for picking a feeling for a post
 * @param {boolean} isVisible - Whether the picker is visible
 * @param {function} onClose - Function to call when the picker is closed
 * @param {function} onSelect - Function to call when a feeling is selected
 * @returns {JSX} The FeelingsPicker component
 */
const FeelingsPicker = ({ isVisible, onClose, onSelect }) => {
  if (!isVisible) return null;

  // Available feelings
  const feelings = [
    'Happy',
    'Sad',
    'Excited',
    'Angry',
    'Loved',
    'Blessed',
    'Thankful',
    'Grateful',
    'Relaxed',
    'Worried',
    'Tired'
  ];

  return (
    <div className="feelings-picker">
      <div className="feelings-header">
        <h4>How are you feeling?</h4>
        <button className="close-feelings" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="feelings-list">
        {feelings.map((feeling) => (
          <button key={feeling} className="feeling-option" onClick={() => onSelect(feeling)}>
            {feeling}
          </button>
        ))}
      </div>
    </div>
  );
};

FeelingsPicker.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default FeelingsPicker;
