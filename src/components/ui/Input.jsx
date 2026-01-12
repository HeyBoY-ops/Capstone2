import React from 'react';

const Input = ({ className = '', error, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <input
        className={className}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-sm)',
          width: '100%',
          outline: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          ...props.style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
          e.target.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
          props.onBlur && props.onBlur(e);
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
