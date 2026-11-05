import React from 'react';

export const GlassPanel = ({
  children,
  className = '',
  elevation = 'default', // 'subtle' | 'default' | 'elevated' | 'modal'
  style = {},
  ...props
}) => {
  const getElevationStyles = () => {
    switch (elevation) {
      case 'subtle':
        return {
          background: 'var(--glass-surface-base)',
          backdropFilter: 'var(--glass-blur-subtle)',
          WebkitBackdropFilter: 'var(--glass-blur-subtle)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: 'var(--glass-shadow-soft)',
        };
      case 'elevated':
        return {
          background: 'var(--glass-surface-elevated)',
          backdropFilter: 'var(--glass-blur-panel)',
          WebkitBackdropFilter: 'var(--glass-blur-panel)',
          border: '1px solid rgba(255, 255, 255, 0.32)',
          boxShadow: 'var(--glass-shadow-deep), var(--glass-shadow-glow)',
          transform: 'translateZ(var(--z-panel))',
        };
      case 'modal':
        return {
          background: 'rgba(255, 255, 255, 0.16)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.7)',
          transform: 'translateZ(var(--z-overlay))',
        };
      default:
        return {
          background: 'var(--glass-surface-base)',
          backdropFilter: 'var(--glass-blur-panel)',
          WebkitBackdropFilter: 'var(--glass-blur-panel)',
          border: '1px solid var(--glass-border-color)',
          boxShadow: 'var(--glass-highlight-top), var(--glass-shadow-deep)',
        };
    }
  };

  return (
    <div
      className={`vision-glass-panel ${className}`}
      style={{
        borderRadius: 'var(--radius-panel)',
        padding: '2.25rem',
        position: 'relative',
        transformStyle: 'preserve-3d',
        ...getElevationStyles(),
        ...style,
      }}
      {...props}
    >
      {/* Top Specular Edge Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7) 50%, transparent)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default GlassPanel;

