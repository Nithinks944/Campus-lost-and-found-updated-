import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI, uploadAPI } from '../services/api';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const ReportItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: 'Other',
    location: '',
    dateLostOrFound: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = '';
      let imagePublicId = '';

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);
        const uploadResponse = await uploadAPI.uploadImage(formDataImage);
        imageUrl = uploadResponse.data.imageUrl;
        imagePublicId = uploadResponse.data.imagePublicId;
      }

      const itemData = {
        ...formData,
        imageUrl,
        imagePublicId,
      };

      const response = await itemsAPI.create(itemData);

      if (response.data.matches && response.data.matches.length > 0) {
        setMatches(response.data.matches);
        setShowMatches(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = () => {
    navigate('/');
  };

  if (showMatches) {
    return (
      <div className="page-container">
        <div className="matches-container">
          <div className="success-message">
            <CheckCircle size={48} />
            <h2>Item Reported Successfully!</h2>
            <p>We found {matches.length} potential match(es) for your item.</p>
          </div>

          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.item._id} className="match-card">
                <div className="match-score">Match: {match.score}%</div>
                {match.item.imageUrl && (
                  <img src={match.item.imageUrl} alt={match.item.title} />
                )}
                <h3>{match.item.title}</h3>
                <p>{match.item.description}</p>
                <div className="match-details">
                  <span>{match.item.category}</span>
                  <span>{match.item.location}</span>
                </div>
                <button
                  onClick={() => navigate(`/items/${match.item._id}`)}
                  className="btn btn-secondary"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleViewMatches} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Report Lost or Found Item</h1>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="ID Card">ID Card</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Black Lenovo Laptop"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Provide detailed description..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Library, CSE Block"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateLostOrFound">Date Lost/Found</label>
            <input
              type="date"
              id="dateLostOrFound"
              name="dateLostOrFound"
              value={formData.dateLostOrFound}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <div className="image-upload">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="image" className="upload-label">
              <Upload size={24} />
              <span>{imageFile ? imageFile.name : 'Choose an image'}</span>
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Report Item'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
