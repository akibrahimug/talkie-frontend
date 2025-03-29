import PropTypes from 'prop-types';
import { bgColors } from '@services/utils/static.data';
import './ColorPicker.scss';

/**
 * @description A component for selecting a background color for posts
 * @param {string} selectedColor - The currently selected color
 * @param {function} onColorSelect - Function to call when a color is selected
 * @param {number} charCount - The current character count
 * @param {number} maxCharCount - The maximum character count allowed
 * @param {boolean} disabled - Whether color selection is disabled
 * @returns {JSX} The ColorPicker component
 */
const ColorPicker = ({ selectedColor, onColorSelect, charCount, maxCharCount, disabled }) => {
  return (
    <div className={`color-picker ${disabled ? 'disabled' : ''}`}>
      <div className="colors-list">
        {bgColors.map((color) => (
          <button
            key={color}
            className={`color-option ${color === selectedColor ? 'selected' : ''} ${
              color === '#ffffff' ? 'white-border' : ''
            } ${disabled ? 'disabled' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => !disabled && onColorSelect(color)}
            aria-label={`Select ${color} background`}
            disabled={disabled}></button>
        ))}
      </div>
      <span className="char-counter">{`${maxCharCount - charCount}/${maxCharCount}`}</span>
    </div>
  );
};

ColorPicker.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  charCount: PropTypes.number.isRequired,
  maxCharCount: PropTypes.number.isRequired,
  disabled: PropTypes.bool
};

ColorPicker.defaultProps = {
  disabled: false
};

export default ColorPicker;
