import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import { TiltCard } from '../components/spatial/TiltCard';
import { CheckCircle, Trash2, AlertCircle, Shield, Sparkles } from 'lucide-react';

export const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchPendingItems();
  }, [isAdmin, navigate]);

  const fetchPendingItems = async () => {
    try {
      const response = await adminAPI.getPendingItems();
      setPendingItems(response.data);
    } catch (err) {
      setError('Failed to load pending items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (itemId) => {
    try {
      await adminAPI.verifyItem(itemId);
      setPendingItems(pendingItems.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Failed to verify item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await adminAPI.deleteItem(itemId);
      setPendingItems(pendingItems.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="spatial-page-container">
      <div className="spatial-catalog-header">
        <div className="spatial-eyebrow-pill" style={{ color: 'var(--accent-purple)' }}>
          <Shield size={14} /> Campus Moderation Deck
        </div>
        <h1 className="spatial-page-title">Admin Dashboard</h1>
        <p className="spatial-page-subtitle">
          Review, approve, or reject unverified student lost &amp; found submissions.
        </p>
      </div>

      {error && (
        <div className="spatial-alert-pill alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spatial-loading-glass vision-glass">
          <div className="spatial-spinner" />
          <span>Retrieving pending queue in visionOS space...</span>
        </div>
      ) : pendingItems.length === 0 ? (
        <GlassPanel elevation="subtle" className="empty-catalog-panel">
          <CheckCircle size={36} color="var(--accent-green)" style={{ marginBottom: '0.75rem' }} />
          <h3>All Caught Up!</h3>
          <p>There are no unverified posts waiting in the queue.</p>
        </GlassPanel>
      ) : (
        <div className="spatial-items-grid">
          {pendingItems.map((item) => (
            <TiltCard key={item._id} maxTilt={5} scale={1.015}>
              <div className="admin-glass-item-card vision-glass-card">
                <div className="admin-card-media">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} />
                  ) : (
                    <div className="spatial-card-placeholder">
                      <span>No Media Uploaded</span>
                    </div>
                  )}
                  <span className={`spatial-type-chip ${item.type === 'lost' ? 'chip-lost' : 'chip-found'}`}>
                    {item.type?.toUpperCase()}
                  </span>
                </div>

                <div className="admin-card-body">
                  <h3 className="spatial-card-title">{item.title}</h3>
                  <p className="spatial-card-desc">{item.description}</p>

                  <div className="admin-user-pill">
                    Posted by: <strong>{item.postedBy?.name || 'Student'}</strong> ({item.postedBy?.email})
                  </div>

                  <div className="admin-action-row">
                    <GlassButton
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleVerify(item._id)}
                      style={{ flex: 1 }}
                    >
                      Verify Post
                    </GlassButton>
                    <GlassButton
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </GlassButton>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
