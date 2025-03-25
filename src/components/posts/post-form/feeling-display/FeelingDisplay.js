import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './FeelingDisplay.scss';

/**
 * @description Component to display the currently selected feeling
 * @param {string} feeling - The selected feeling
 * @param {function} onRemove - Function to call when the feeling is removed
 * @returns {JSX} The FeelingDisplay component
 */
const FeelingDisplay = ({ feeling, onRemove }) => {
  if (!feeling) return null;

  return (
    <div className="feeling-display">
      Feeling <span>{feeling}</span>
      <button className="remove-feeling" onClick={onRemove}>
        <FaTimes />
      </button>
    </div>
  );
};

FeelingDisplay.propTypes = {
  feeling: PropTypes.string,
  onRemove: PropTypes.func.isRequired
};

export default FeelingDisplay;
