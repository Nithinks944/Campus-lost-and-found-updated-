import React, { useRef, useState, useEffect } from 'react';

export const TiltCard = ({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.015,
  style = {},
  perspective = 1000,
  glowColor = 'rgba(59, 130, 246, 0.25)',
  ...props
}) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ px: 50, py: 50 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (isReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setCoords({ x: rotateX, y: rotateY });
    setMousePos({
      px: Math.round((x / rect.width) * 100),
      py: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    if (!isReducedMotion) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
    setMousePos({ px: 50, py: 50 });
  };

  const transformStyle = isReducedMotion
    ? undefined
    : `perspective(${perspective}px) rotateX(${coords.x.toFixed(2)}deg) rotateY(${coords.y.toFixed(2)}deg) ${
        isHovered ? `scale3d(${scale}, ${scale}, 1)` : 'scale3d(1, 1, 1)'
      }`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`vision-tilt-card ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease'
          : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 500ms ease',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {/* Specular Radial Gaze Highlight following pointer */}
      <div
        className="tilt-specular-highlight"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 380px at ${mousePos.px}% ${mousePos.py}%, rgba(255, 255, 255, 0.22), ${glowColor} 45%, transparent 80%)`,
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          transition: 'opacity 300ms ease',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content wrapper with preserve-3d to let children sit on separate translateZ layers */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          transformStyle: 'preserve-3d',
          height: '100%',
        }}
      >
        {children}
      </div>

      {/* Floating Contact Shadow beneath the card */}
      <div
        className="tilt-contact-shadow"
        style={{
          position: 'absolute',
          bottom: '-18px',
          left: '8%',
          right: '8%',
          height: '24px',
          background: 'rgba(0, 0, 0, 0.45)',
          filter: 'blur(22px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: isHovered ? 0.9 : 0.4,
          transform: isHovered ? 'scale(1.06) translateY(6px)' : 'scale(0.95)',
          transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 0,
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default TiltCard;

