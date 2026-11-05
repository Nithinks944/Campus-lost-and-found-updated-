import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useSpatialTheme = () => useContext(ThemeContext);

export const SpatialScene = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('spatial-theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spatial-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="spatial-stage">
        {/* Living Ambient 3D Room Orbs */}
        <div className="spatial-environment" aria-hidden="true">
          <div className="spatial-orb orb-primary" />
          <div className="spatial-orb orb-secondary" />
          <div className="spatial-orb orb-warm" />
          <div className="spatial-orb orb-accent" />
          <div className="spatial-noise" />
        </div>

        {/* Spatial Content Layer */}
        <div className="spatial-content-layer">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default SpatialScene;

