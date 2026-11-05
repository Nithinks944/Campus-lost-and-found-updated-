import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, CheckCircle2, Compass } from 'lucide-react';

export const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';

  return (
    <Link to={`/items/${item._id}`} className="spatial-item-card vision-glass-card gaze-target">
      {/* Visual Image Preview with Layered Status Chips */}
      <div className="spatial-card-media">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="spatial-card-placeholder">
            <span>No Image Preview</span>
          </div>
        )}

        {/* Floating Glass Chips inside Media */}
        <div className="spatial-media-badges">
          <span className={`spatial-type-chip ${isLost ? 'chip-lost' : 'chip-found'}`}>
            {item.type?.toUpperCase()}
          </span>

          <span className={`spatial-status-chip status-${item.status}`}>
            {item.status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="spatial-card-body">
        <div className="spatial-card-header">
          <h3 className="spatial-card-title">{item.title}</h3>
          {item.isVerified && (
            <span className="spatial-verified-pill" title="Admin Verified Post">
              <CheckCircle2 size={13} />
            </span>
          )}
        </div>

        <p className="spatial-card-desc">{item.description}</p>

        {/* Metadata Chips */}
        <div className="spatial-card-meta-row">
          <div className="meta-pill">
            <Tag size={13} className="meta-icon" />
            <span>{item.category}</span>
          </div>

          <div className="meta-pill">
            <MapPin size={13} className="meta-icon" />
            <span className="meta-truncate">{item.location}</span>
          </div>

          {item.campusZone && item.campusZone !== 'General Campus Area' && (
            <div className="meta-pill zone-pill">
              <Compass size={13} className="meta-icon" />
              <span className="meta-truncate">{item.campusZone}</span>
            </div>
          )}

          <div className="meta-pill date-pill">
            <Calendar size={13} className="meta-icon" />
            <span>{new Date(item.dateReported).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
