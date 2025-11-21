import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Tag, User, CheckCircle } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setItem(response.data);
    } catch (err) {
      setError('Failed to load item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await itemsAPI.updateStatus(id, newStatus);
      setItem({ ...item, status: newStatus });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const isOwner = user && item && item.postedBy._id === user.id;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!item) return <div className="error-message">Item not found</div>;

  return (
    <div className="page-container">
      <div className="item-details">
        <div className="item-details-image">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} />
          ) : (
            <div className="item-details-placeholder">No Image Available</div>
          )}
        </div>

        <div className="item-details-content">
          <div className="item-header">
            <h1 className="item-title">{item.title}</h1>
            <div className="item-badges">
              <span className={`status-badge ${item.status}`}>{item.status}</span>
              <span className={`type-badge ${item.type}`}>{item.type}</span>
              {item.isVerified && (
                <span className="verified-badge">
                  <CheckCircle size={16} />
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="item-info-grid">
            <div className="item-info">
              <Tag size={20} />
              <div>
                <span className="info-label">Category</span>
                <span className="info-value">{item.category}</span>
              </div>
            </div>

            <div className="item-info">
              <MapPin size={20} />
              <div>
                <span className="info-label">Location</span>
                <span className="info-value">{item.location}</span>
              </div>
            </div>

            <div className="item-info">
              <Calendar size={20} />
              <div>
                <span className="info-label">Date Reported</span>
                <span className="info-value">
                  {new Date(item.dateReported).toLocaleDateString()}
                </span>
              </div>
            </div>

            {item.dateLostOrFound && (
              <div className="item-info">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Date {item.type === 'lost' ? 'Lost' : 'Found'}</span>
                  <span className="info-value">
                    {new Date(item.dateLostOrFound).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="item-info">
              <User size={20} />
              <div>
                <span className="info-label">Posted By</span>
                <span className="info-value">{item.postedBy.name}</span>
              </div>
            </div>
          </div>

          <div className="item-description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          {(isOwner || isAdmin) && (
            <div className="item-actions">
              <h3>Update Status</h3>
              <div className="status-buttons">
                <button
                  onClick={() => handleStatusChange('open')}
                  className={`btn ${item.status === 'open' ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={item.status === 'open'}
                >
                  Open
                </button>
                <button
                  onClick={() => handleStatusChange('matched')}
                  className={`btn ${item.status === 'matched' ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={item.status === 'matched'}
                >
                  Matched
                </button>
                <button
                  onClick={() => handleStatusChange('closed')}
                  className={`btn ${item.status === 'closed' ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={item.status === 'closed'}
                >
                  Closed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
