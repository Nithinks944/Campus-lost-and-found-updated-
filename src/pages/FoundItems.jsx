import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { Search, Tag, MapPin, CheckCircle, Sparkles } from 'lucide-react';

export const FoundItems = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    campusZone: searchParams.get('campusZone') || '',
    q: '',
  });

  useEffect(() => {
    const zoneFromUrl = searchParams.get('campusZone');
    if (zoneFromUrl) {
      setFilters((prev) => ({ ...prev, campusZone: zoneFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = { type: 'found', ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      const response = await itemsAPI.getAll(params);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="spatial-page-container">
      {/* Page Header */}
      <div className="spatial-catalog-header">
        <div className="spatial-eyebrow-pill" style={{ color: 'var(--accent-green)' }}>
          <CheckCircle size={14} /> Recovered Belongings
        </div>
        <h1 className="spatial-page-title">Found Items</h1>
        <p className="spatial-page-subtitle">
          Recovered items awaiting verification and return to rightful owners.
        </p>
      </div>

      {/* Floating Frosted Glass Filter Bar */}
      <GlassPanel elevation="subtle" className="spatial-filter-bar">
        <div className="filter-bar-grid">
          {/* Search Term */}
          <div className="filter-cell search-cell">
            <label className="filter-label" htmlFor="q">
              <Search size={14} /> Search Keywords
            </label>
            <div className="glass-cell-input">
              <input
                type="text"
                id="q"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="Title, brand, location..."
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="filter-cell">
            <label className="filter-label" htmlFor="category">
              <Tag size={14} /> Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="glass-select-input"
            >
              <option value="">All Categories</option>
              <option value="ID Card">ID Card</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books &amp; Notes</option>
              <option value="Keys">Keys &amp; Keychains</option>
              <option value="Wallet">Wallet / Purse</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Campus Zone Select */}
          <div className="filter-cell">
            <label className="filter-label" htmlFor="campusZone">
              <MapPin size={14} /> Campus Zone
            </label>
            <select
              id="campusZone"
              name="campusZone"
              value={filters.campusZone}
              onChange={handleFilterChange}
              className="glass-select-input"
            >
              <option value="">All Zones</option>
              <option value="Central Library">Central Library</option>
              <option value="Engineering / Tech Block">Tech Block</option>
              <option value="Cafeteria / Food Court">Cafeteria / Food Court</option>
              <option value="Sports Complex & Gym">Sports Complex</option>
              <option value="Main Auditorium">Main Auditorium</option>
              <option value="Student Hostels">Student Hostels</option>
              <option value="Main Entrance Gate">Main Entrance Gate</option>
            </select>
          </div>
        </div>
      </GlassPanel>

      {/* Results Count */}
      <div className="results-status-row">
        <span>Showing {items.length} found items waiting for claim</span>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="spatial-loading-glass vision-glass">
          <div className="spatial-spinner" />
          <span>Scanning recovered items...</span>
        </div>
      ) : (
        <div className="spatial-items-grid">
          {items.length > 0 ? (
            items.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <GlassPanel elevation="subtle" className="empty-catalog-panel" style={{ gridColumn: '1 / -1' }}>
              <p>No recovered items found matching your filters.</p>
            </GlassPanel>
          )}
        </div>
      )}
    </div>
  );
};

export default FoundItems;
