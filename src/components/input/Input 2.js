import React from 'react';
import PropTypes from 'prop-types';
import '@components/input/Input.scss';

const Input = ({ id, name, type, value, className, labelText, placeholder, handleChange, style }) => {
  return (
    <div className="form-row">
      {labelText && (
        <label htmlFor={id} className="form-label">
          {labelText}
        </label>
      )}
      <input
        id={id}
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
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
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
