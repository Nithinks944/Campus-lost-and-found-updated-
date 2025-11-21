import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Trash2, AlertCircle } from 'lucide-react';

const Admin = () => {
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage pending item verifications</p>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {pendingItems.length === 0 ? (
        <div className="empty-message">No pending items for verification.</div>
      ) : (
        <div className="admin-grid">
          {pendingItems.map((item) => (
            <div key={item._id} className="admin-card">
              <div className="admin-card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} />
                ) : (
                  <div className="admin-card-placeholder">No Image</div>
                )}
              </div>

              <div className="admin-card-content">
                <h3>{item.title}</h3>
                <p className="admin-card-description">{item.description}</p>

                <div className="admin-card-details">
                  <span className={`type-badge ${item.type}`}>{item.type}</span>
                  <span>{item.category}</span>
                  <span>{item.location}</span>
                </div>

                <div className="admin-card-user">
                  Posted by: <strong>{item.postedBy.name}</strong>
                </div>

                <div className="admin-card-actions">
                  <button
                    onClick={() => handleVerify(item._id)}
                    className="btn btn-success"
                  >
                    <CheckCircle size={18} />
                    Verify
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
