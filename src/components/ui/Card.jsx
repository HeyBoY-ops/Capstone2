import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 transition-smooth ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
