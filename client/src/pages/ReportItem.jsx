import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { itemsAPI, uploadAPI } from '../services/api';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import { GlassInput } from '../components/spatial/GlassInput';
import { TiltCard } from '../components/spatial/TiltCard';
import {
  Upload,
  AlertCircle,
  CheckCircle,
  MapPin,
  ShieldQuestion,
  Sparkles,
  Tag,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

export const ReportItem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: 'Other',
    location: '',
    campusZone: 'General Campus Area',
    secretQuestion: '',
    dateLostOrFound: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);

  useEffect(() => {
    const prefillZone = searchParams.get('zone');
    const prefillFoundItem = searchParams.get('foundItem');
    const prefillOwnerTag = searchParams.get('ownerTag');

    if (prefillZone) {
      setFormData((prev) => ({ ...prev, campusZone: prefillZone, location: prefillZone }));
    }

    if (prefillFoundItem) {
      setFormData((prev) => ({
        ...prev,
        type: 'found',
        title: `Found ${prefillFoundItem} (QR Tagged)`,
        description: `Found item tagged via QR badge for ${prefillOwnerTag || 'Student'}. Please verify ownership.`,
        category: prefillFoundItem.includes('Laptop')
          ? 'Electronics'
          : prefillFoundItem.includes('Card')
          ? 'ID Card'
          : 'Other',
      }));
    }
  }, [searchParams]);

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

  if (showMatches) {
    return (
      <div className="spatial-page-container">
        <GlassPanel elevation="elevated" className="matches-glass-stage">
          <div className="matches-hero-header">
            <div className="matches-icon-halo">
              <CheckCircle size={36} color="var(--accent-green)" />
            </div>
            <h2 className="spatial-hero-title" style={{ fontSize: '2rem' }}>
              Item Reported Successfully!
            </h2>
            <p className="spatial-subtitle">
              Smart Jaccard Engine detected {matches.length} potential correspondence(s).
            </p>
          </div>

          <div className="spatial-items-grid" style={{ marginTop: '2rem' }}>
            {matches.map((match) => (
              <div key={match.item._id} className="match-glass-card vision-glass-card">
                <div className="match-score-pill">
                  <Sparkles size={13} /> {match.score}% Similarity
                </div>
                {match.item.imageUrl && (
                  <img src={match.item.imageUrl} alt={match.item.title} className="match-image-preview" />
                )}
                <h3 className="match-item-title">{match.item.title}</h3>
                <p className="match-item-desc">{match.item.description}</p>
                <div className="match-meta-line">
                  <span>{match.item.category}</span>
                  <span>•</span>
                  <span>{match.item.location}</span>
                </div>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/items/${match.item._id}`)}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  View Details &amp; Verify
                </GlassButton>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <GlassButton variant="primary" size="lg" onClick={() => navigate('/')}>
              Proceed to Home Feed
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="spatial-page-container" style={{ maxWidth: '900px' }}>
      <div className="spatial-catalog-header">
        <div className="spatial-eyebrow-pill">
          <Sparkles size={14} /> Item Incident Registry
        </div>
        <h1 className="spatial-page-title">Report Item</h1>
        <p className="spatial-page-subtitle">
          Submit details for a lost or recovered belonging to initiate automated similarity matching.
        </p>
      </div>

      {error && (
        <div className="spatial-alert-pill alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <GlassPanel elevation="elevated" className="report-glass-panel">
        <form onSubmit={handleSubmit}>
          {/* Segmented Type Switch */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="qr-form-label">Report Type</label>
            <div className="spatial-segmented-capsule">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'lost' })}
                className={`segmented-pill-btn ${formData.type === 'lost' ? 'segmented-active' : ''}`}
              >
                I Lost an Item
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'found' })}
                className={`segmented-pill-btn ${formData.type === 'found' ? 'segmented-active' : ''}`}
              >
                I Found an Item
              </button>
            </div>
          </div>

          <div className="form-row-2col">
            <div className="filter-cell" style={{ marginBottom: '1.25rem' }}>
              <label className="filter-label" htmlFor="category">
                <Tag size={14} /> Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="glass-select-input"
                required
              >
                <option value="ID Card">ID Card</option>
                <option value="Electronics">Electronics (Laptop, Phone, Charger)</option>
                <option value="Books">Books &amp; Notebooks</option>
                <option value="Keys">Keys &amp; Keychains</option>
                <option value="Wallet">Wallet / Purse</option>
                <option value="Clothing">Clothing &amp; Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-cell" style={{ marginBottom: '1.25rem' }}>
              <label className="filter-label" htmlFor="campusZone">
                <MapPin size={14} /> Campus Zone / Hotspot
              </label>
              <select
                id="campusZone"
                name="campusZone"
                value={formData.campusZone}
                onChange={handleChange}
                className="glass-select-input"
                required
              >
                <option value="Central Library">Central Library</option>
                <option value="Engineering / Tech Block">Engineering / Tech Block</option>
                <option value="Cafeteria / Food Court">Cafeteria / Food Court</option>
                <option value="Sports Complex & Gym">Sports Complex & Gym</option>
                <option value="Main Auditorium">Main Auditorium</option>
                <option value="Student Hostels">Student Hostels</option>
                <option value="Main Entrance Gate">Main Entrance Gate</option>
                <option value="General Campus Area">General Campus Area</option>
              </select>
            </div>
          </div>

          <GlassInput
            id="title"
            name="title"
            label="Item Title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Midnight Blue Dell XPS 15"
          />

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="qr-form-label">Detailed Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="spatial-textarea"
              placeholder="Describe distinctive marks, brand, model, stickers, or unique scratches..."
            />
          </div>

          <div className="form-row-2col">
            <GlassInput
              id="location"
              name="location"
              label="Specific Spot / Room"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. 2nd Floor Study Room Desk 14"
            />

            <GlassInput
              id="dateLostOrFound"
              name="dateLostOrFound"
              type="date"
              label={`Date ${formData.type === 'lost' ? 'Lost' : 'Found'}`}
              icon={Calendar}
              value={formData.dateLostOrFound}
              onChange={handleChange}
            />
          </div>

          {/* Anti-Fraud Security Question */}
          <GlassInput
            id="secretQuestion"
            name="secretQuestion"
            label="Anti-Fraud Security Question (Optional for Found Items)"
            icon={ShieldQuestion}
            value={formData.secretQuestion}
            onChange={handleChange}
            placeholder="e.g. What sticker is on the back? What is the wallpaper image?"
          />

          {/* Image Upload Area */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="qr-form-label">Upload Photographic Evidence</label>
            <div className="spatial-dropzone">
              <input
                type="file"
                id="image-file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-file-input" className="spatial-dropzone-label gaze-target">
                <Upload size={24} className="dropzone-icon" />
                <span>{imageFile ? imageFile.name : 'Choose an image file from device'}</span>
              </label>

              {imagePreview && (
                <div className="spatial-image-preview-box">
                  <img src={imagePreview} alt="Upload preview" />
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Submitting & Computing Similarity...' : 'Publish Item to Spatial Database'}
            </GlassButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
};

export default ReportItem;
