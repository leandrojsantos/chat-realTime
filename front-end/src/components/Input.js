import React from 'react';

const Input = ({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  maxLength,
  onKeyPress,
  className = '',
  ariaLabel,
  ...props 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyPress={onKeyPress}
      className={className}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Input;
