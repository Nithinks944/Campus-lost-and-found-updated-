import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSpatialTheme } from './spatial/SpatialScene';
import {
  PackageSearch,
  LogOut,
  Compass,
  QrCode,
  Plus,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useSpatialTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="spatial-nav-wrapper">
      <nav className="spatial-nav-pill vision-glass-pill" aria-label="Main Navigation">
        {/* Brand Capsule */}
        <Link to="/" className="spatial-brand-pill gaze-target" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-halo">
            <PackageSearch size={20} />
          </div>
          <span className="brand-text">Campus L&amp;F</span>
          <span className="spatial-badge">visionOS</span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="spatial-nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `spatial-link-capsule ${isActive ? 'capsule-active' : ''}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/lost"
            className={({ isActive }) => `spatial-link-capsule ${isActive ? 'capsule-active' : ''}`}
          >
            Lost Items
          </NavLink>

          <NavLink
            to="/found"
            className={({ isActive }) => `spatial-link-capsule ${isActive ? 'capsule-active' : ''}`}
          >
            Found Items
          </NavLink>

          <NavLink
            to="/radar"
            className={({ isActive }) => `spatial-link-capsule ${isActive ? 'capsule-active' : ''}`}
          >
            <Compass size={15} style={{ marginRight: '4px' }} /> Radar
          </NavLink>

          <NavLink
            to="/qr-tags"
            className={({ isActive }) => `spatial-link-capsule ${isActive ? 'capsule-active' : ''}`}
          >
            <QrCode size={15} style={{ marginRight: '4px' }} /> QR Tags
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `spatial-link-capsule report-pill ${isActive ? 'capsule-active' : ''}`
                }
              >
                <Plus size={15} style={{ marginRight: '2px' }} /> Report
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `spatial-link-capsule admin-pill ${isActive ? 'capsule-active' : ''}`
                  }
                >
                  <Shield size={15} style={{ marginRight: '3px' }} /> Admin
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right Action: User profile or Login */}
        <div className="spatial-nav-actions">
          {/* Quick theme toggle in nav for mobile/header access */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-nav-btn gaze-target"
            title={`Switch to ${theme === 'dark' ? 'Light Day' : 'Dark Space'}`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {isAuthenticated ? (
            <div className="user-profile-capsule">
              <span className="user-name-label">
                {user?.name?.split(' ')[0] || 'Student'}
              </span>
              <button onClick={handleLogout} className="logout-icon-btn gaze-target" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-pill-btn gaze-target">
              <Sparkles size={15} />
              <span>Login / OTP</span>
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Floats over spatial scene) */}
      {mobileMenuOpen && (
        <div className="spatial-mobile-drawer vision-glass">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            Home
          </NavLink>
          <NavLink to="/lost" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            Lost Items
          </NavLink>
          <NavLink to="/found" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            Found Items
          </NavLink>
          <NavLink to="/radar" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            Campus Radar
          </NavLink>
          <NavLink to="/qr-tags" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            QR Finder Tags
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/report" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
                Report Item
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
                  Admin Dashboard
                </NavLink>
              )}
              <button onClick={handleLogout} className="mobile-nav-item mobile-logout">
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item mobile-login">
              Login with OTP
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
