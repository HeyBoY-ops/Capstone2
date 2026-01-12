import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'white',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: 'white',
    }
  };

  return (
    <button
      className={`btn-${variant} ${className}`}
      style={{ ...baseStyles, ...variants[variant], ...props.style }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
