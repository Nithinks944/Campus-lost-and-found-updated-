import React from 'react';

export const GlassButton = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  style = {},
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.45rem 1rem',
          fontSize: '0.85rem',
          gap: '0.4rem',
        };
      case 'lg':
        return {
          padding: '0.9rem 2rem',
          fontSize: '1.05rem',
          fontWeight: '700',
          gap: '0.6rem',
        };
      default:
        return {
          padding: '0.65rem 1.4rem',
          fontSize: '0.95rem',
          fontWeight: '600',
          gap: '0.5rem',
        };
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'glass-btn-primary';
      case 'secondary':
        return 'glass-btn-secondary';
      case 'danger':
        return 'glass-btn-danger';
      case 'ghost':
        return 'glass-btn-ghost';
      default:
        return 'glass-btn-primary';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`vision-glass-btn ${getVariantClass()} ${className}`}
      style={{
        borderRadius: 'var(--radius-pill)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        textDecoration: 'none',
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {/* Specular button sheen */}
      <div className="btn-sheen-highlight" aria-hidden="true" />
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} className="btn-icon" />}
      <span className="btn-label">{children}</span>
    </button>
  );
};

export default GlassButton;

