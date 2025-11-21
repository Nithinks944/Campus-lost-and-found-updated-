import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search } from 'lucide-react';

const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    q: '',
  });

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
    <div className="page-container">
      <h1 className="page-title">Found Items</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="ID Card">ID Card</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="e.g., Library"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="q">Search</label>
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              id="q"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Search by title or description"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="items-grid">
          {items.length > 0 ? (
            items.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <p className="empty-message">No found items matching your filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FoundItems;
