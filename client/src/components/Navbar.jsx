import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PackageSearch, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <PackageSearch size={28} />
          <span>Campus Lost & Found</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/lost" className="nav-link">Lost Items</Link>
          <Link to="/found" className="nav-link">Found Items</Link>

          {isAuthenticated && (
            <>
              <Link to="/report" className="nav-link nav-link-primary">Report Item</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
            </>
          )}

          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-username">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-logout">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link nav-link-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
