import React from 'react';
import PropTypes from 'prop-types';
import '@components/input/Input.scss';
const Input = ({ name, type, value, className, labelText, placeholder, handleChange, style }) => {
  return (
    <>
      <div className="form-row">
        {labelText && (
          <label htmlFor={name} className="form-label">
            {labelText}
          </label>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${className} form-input`}
          autoComplete="false"
          style={style}
        />
      </div>
    </>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Input;
