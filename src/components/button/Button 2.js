import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { label, className, disabled, handleClick } = props;
  return (
    <>
      <button onClick={handleClick} className={className} disabled={disabled}>
        {label}
      </button>
    </>
  );
};

Button.propTypes = {
  label: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func
};

export default Button;
