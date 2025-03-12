import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import '@components/input/Input.scss';

const Input = forwardRef(
  ({ id, name, type, value, className, labelText, placeholder, handleChange, style, onClick }, ref) => {
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
          ref={ref}
          onClick={onClick}
        />
      </div>
    );
  }
);

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  labelText: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func
};

Input.displayName = 'Input';

export default Input;
