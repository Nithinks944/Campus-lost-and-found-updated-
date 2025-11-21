import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, AlertCircle } from 'lucide-react';

const Home = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const [lostRes, foundRes] = await Promise.all([
        itemsAPI.getAll({ type: 'lost' }),
        itemsAPI.getAll({ type: 'found' }),
      ]);

      setLostItems(lostRes.data.slice(0, 6));
      setFoundItems(foundRes.data.slice(0, 6));
    } catch (err) {
      setError('Failed to load items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Campus Lost & Found</h1>
          <p className="hero-subtitle">
            Help reunite lost items with their owners. Report lost or found items and let our
            smart matching system do the rest.
          </p>
          <div className="hero-actions">
            <Link to="/report" className="btn btn-primary">Report an Item</Link>
            <Link to="/lost" className="btn btn-secondary">Browse Lost Items</Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recently Lost Items</h2>
          <Link to="/lost" className="section-link">View All</Link>
        </div>
        <div className="items-grid">
          {lostItems.length > 0 ? (
            lostItems.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <p className="empty-message">No lost items yet.</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recently Found Items</h2>
          <Link to="/found" className="section-link">View All</Link>
        </div>
        <div className="items-grid">
          {foundItems.length > 0 ? (
            foundItems.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <p className="empty-message">No found items yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
