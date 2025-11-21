import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';

const ItemCard = ({ item }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'matched':
        return 'status-matched';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-open';
    }
  };

  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} />
        ) : (
          <div className="item-card-placeholder">No Image</div>
        )}
        <span className={`item-badge ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>

      <div className="item-card-content">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-description">{item.description}</p>

        <div className="item-card-details">
          <div className="item-detail">
            <Tag size={16} />
            <span>{item.category}</span>
          </div>
          <div className="item-detail">
            <MapPin size={16} />
            <span>{item.location}</span>
          </div>
          <div className="item-detail">
            <Calendar size={16} />
            <span>{new Date(item.dateReported).toLocaleDateString()}</span>
          </div>
        </div>

        {item.isVerified && (
          <span className="verified-badge">Verified</span>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
