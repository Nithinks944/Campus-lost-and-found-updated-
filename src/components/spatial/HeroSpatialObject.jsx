import React from 'react';

export const HeroSpatialObject = ({
  size = 280,
  className = '',
  style = {},
  variant = 'key', // 'key' | 'pin' | 'shield'
}) => {
  return (
    <div
      className={`hero-spatial-object-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Dynamic 3D Floating Gyro Glass Rings */}
      <div className="spatial-gyro-ring ring-outer" />
      <div className="spatial-gyro-ring ring-middle" />
      <div className="spatial-gyro-ring ring-inner" />

      {/* Radiant Floating Core (Crystal Prism with Refractions) */}
      <div className="spatial-core-prism">
        {/* SVG Glass Hologram of Campus Key & Location Beacon */}
        <svg
          viewBox="0 0 100 100"
          className="spatial-prism-svg"
          style={{ width: '65%', height: '65%', filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.65))' }}
        >
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.9" />
            </linearGradient>

            <radialGradient id="prismLight" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Prismatic Hexagon Crystal */}
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            fill="url(#glassGradient)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Facet Refraction Shards */}
          <polygon points="50,6 50,50 88,28" fill="url(#prismLight)" opacity="0.6" />
          <polygon points="88,28 50,50 88,72" fill="#2563eb" opacity="0.35" />
          <polygon points="88,72 50,50 50,94" fill="#1d4ed8" opacity="0.5" />
          <polygon points="50,94 50,50 12,72" fill="url(#glassGradient)" opacity="0.4" />
          <polygon points="12,72 50,50 12,28" fill="#3b82f6" opacity="0.3" />
          <polygon points="12,28 50,50 50,6" fill="url(#prismLight)" opacity="0.7" />

          {/* Central Floating Symbol: Spatial Campus Key & Tag Pin */}
          <g transform="translate(25, 25) scale(0.5)" filter="url(#softGlow)">
            {/* Key Head */}
            <circle cx="50" cy="35" r="24" fill="none" stroke="url(#goldGradient)" strokeWidth="8" />
            <circle cx="50" cy="35" r="10" fill="#ffffff" opacity="0.9" />
            {/* Key Stem */}
            <rect x="46" y="55" width="8" height="42" rx="4" fill="url(#goldGradient)" />
            {/* Key Teeth */}
            <rect x="54" y="78" width="16" height="6" rx="2" fill="url(#goldGradient)" />
            <rect x="54" y="90" width="12" height="6" rx="2" fill="url(#goldGradient)" />
            {/* Luminous Sparkle */}
            <circle cx="50" cy="35" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* Ambient Core Light Flare */}
        <div className="spatial-core-glow" />
      </div>

      {/* 3D Contact Shadow on the Floor */}
      <div className="spatial-object-shadow" />
    </div>
  );
};

export default HeroSpatialObject;

