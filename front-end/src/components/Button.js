import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '', 
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
