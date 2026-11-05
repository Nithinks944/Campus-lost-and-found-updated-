import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SpatialScene from './components/spatial/SpatialScene';
import IconRail from './components/spatial/IconRail';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import Admin from './pages/Admin';
import CampusRadar from './pages/CampusRadar';
import QRTagGenerator from './pages/QRTagGenerator';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="spatial-loading-screen">
        <div className="spatial-spinner" />
        <span>Authenticating in visionOS space...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <SpatialScene>
        <Router>
          <div className="spatial-app-shell">
            {/* Desktop Left Icon Rail */}
            <IconRail />

            {/* Main Application Area */}
            <div className="spatial-viewport-container">
              {/* Floating Top Capsule Navbar */}
              <Navbar />

              {/* Main Routed Content */}
              <main className="spatial-main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/lost" element={<LostItems />} />
                  <Route path="/found" element={<FoundItems />} />
                  <Route path="/radar" element={<CampusRadar />} />
                  <Route path="/qr-tags" element={<QRTagGenerator />} />
                  <Route path="/items/:id" element={<ItemDetails />} />
                  <Route
                    path="/report"
                    element={
                      <ProtectedRoute>
                        <ReportItem />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </SpatialScene>
    </AuthProvider>
  );
}

export default App;
