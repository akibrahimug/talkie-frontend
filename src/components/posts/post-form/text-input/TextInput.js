import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import './TextInput.scss';

/**
 * @description Component for inputting post text
 * @param {Object} profile - The user profile object
 * @param {string} text - The current text input value
 * @param {function} onChange - Function to call when text changes
 * @param {function} onFocus - Function to call when input is focused
 * @param {string} selectedColor - The currently selected background color
 * @param {boolean} isExpanded - Whether the form is expanded
 * @returns {JSX} The TextInput component
 */
const TextInput = ({ profile, text, onChange, onFocus, selectedColor, isExpanded }) => {
  const textareaRef = useRef(null);

  // Update text styling when selected color changes
  useEffect(() => {
    if (textareaRef.current) {
      if (selectedColor !== '#ffffff') {
        textareaRef.current.classList.add('with-color-bg');
      } else {
        textareaRef.current.classList.remove('with-color-bg');
      }
    }
  }, [selectedColor]);

  // Focus the textarea when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <div className="text-input-container">
      <textarea
        className={`text-input-textarea ${selectedColor !== '#ffffff' ? 'with-color-bg' : ''}`}
        placeholder="Write something here..."
        rows={isExpanded ? 4 : 1}
        ref={textareaRef}
        value={text}
        onChange={onChange}
        onFocus={onFocus}
        data-testid="input-body"
      />
    </div>
  );
};

TextInput.propTypes = {
  profile: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired
};

export default TextInput;
