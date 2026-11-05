import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSpatialTheme } from './SpatialScene';
import {
  Home,
  Search,
  CheckCircle,
  Compass,
  QrCode,
  PlusCircle,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';

export const IconRail = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useSpatialTheme();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/lost', icon: Search, label: 'Lost Items' },
    { to: '/found', icon: CheckCircle, label: 'Found Items' },
    { to: '/radar', icon: Compass, label: 'Campus Radar' },
    { to: '/qr-tags', icon: QrCode, label: 'QR Finder Tags' },
  ];

  if (isAuthenticated) {
    navItems.push({ to: '/report', icon: PlusCircle, label: 'Report Item' });
    if (isAdmin) {
      navItems.push({ to: '/admin', icon: Shield, label: 'Admin Panel' });
    }
  }

  return (
    <aside className="spatial-icon-rail" aria-label="Quick Navigation">
      <div className="icon-rail-glass">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rail-icon-btn ${isActive ? 'rail-active' : ''}`
              }
              title={item.label}
            >
              <Icon size={20} />
              <span className="rail-tooltip">{item.label}</span>
            </NavLink>
          );
        })}

        <div className="rail-divider" />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rail-icon-btn rail-theme-toggle"
          title={`Switch to ${theme === 'dark' ? 'Day Room (Light)' : 'Vision Dark Room'}`}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          <span className="rail-tooltip">
            {theme === 'dark' ? 'Day Light' : 'Night Room'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default IconRail;

