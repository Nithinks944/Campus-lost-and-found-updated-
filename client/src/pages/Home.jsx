import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { GlassButton } from '../components/spatial/GlassButton';
import { TiltCard } from '../components/spatial/TiltCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import {
  Compass,
  QrCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react';

export const Home = () => {
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

  return (
    <div className="spatial-page-container">
      {/* VisionOS Hero Stage */}
      <section className="spatial-hero-section">
        <div className="spatial-hero-content">
          <div className="spatial-eyebrow-pill gaze-target">
            <Sparkles size={15} className="sparkle-icon" />
            <span>visionOS Spatial Environment • Campus Intelligence</span>
          </div>

          <h1 className="spatial-grand-title">
            Campus Lost <span className="title-gradient">&amp; Found</span>
          </h1>

          <p className="spatial-hero-description">
            Reunite misplaced campus valuables with real-time Jaccard similarity matching,
            spatial hotspot radar, and secure email OTP verification.
          </p>

          <div className="spatial-hero-cta-row">
            <Link to="/report">
              <GlassButton variant="primary" size="lg" icon={Plus}>
                Report an Item
              </GlassButton>
            </Link>

            <Link to="/lost">
              <GlassButton variant="secondary" size="lg" icon={Search}>
                Browse Lost Items
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="spatial-alert-pill alert-error" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Spatial Spotlight Trilogy Panels (TiltCards) */}
      <section className="spatial-spotlight-grid">
        <TiltCard maxTilt={5} scale={1.02} className="spotlight-card">
          <Link to="/radar" className="spotlight-link-content vision-glass-card">
            <div className="spotlight-icon-circle blue-glow">
              <Compass size={24} />
            </div>
            <h3 className="spotlight-title">Campus Hotspot Radar</h3>
            <p className="spotlight-desc">
              Spatial density maps tracking lost and found frequencies across Library, Tech Block, and Cafeteria.
            </p>
            <div className="spotlight-action-label">
              <span>Inspect Radar Map</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        </TiltCard>

        <TiltCard maxTilt={5} scale={1.02} className="spotlight-card">
          <Link to="/qr-tags" className="spotlight-link-content vision-glass-card">
            <div className="spotlight-icon-circle purple-glow">
              <QrCode size={24} />
            </div>
            <h3 className="spotlight-title">Smart QR Finder Tags</h3>
            <p className="spotlight-desc">
              Generate customizable printable QR codes for laptops, IDs, and keys so finders can notify you in one click.
            </p>
            <div className="spotlight-action-label">
              <span>Create Printable Tag</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        </TiltCard>

        <TiltCard maxTilt={5} scale={1.02} className="spotlight-card">
          <div className="spotlight-link-content vision-glass-card">
            <div className="spotlight-icon-circle green-glow">
              <ShieldCheck size={24} />
            </div>
            <h3 className="spotlight-title">Anti-Fraud Security Quiz</h3>
            <p className="spotlight-desc">
              Prevents false claims by requiring claimants to answer private security questions and submit proof before hand-off.
            </p>
            <div className="spotlight-action-label" style={{ color: 'var(--accent-green)' }}>
              <span>Integrated on all posts</span>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* Recently Lost Section */}
      <section className="spatial-catalog-section">
        <div className="spatial-section-header">
          <div>
            <h2 className="spatial-section-title">Recently Lost Items</h2>
            <p className="spatial-section-sub">Items currently reported missing by students</p>
          </div>
          <Link to="/lost">
            <GlassButton variant="ghost" size="sm">
              View All ({lostItems.length}) →
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="spatial-loading-glass vision-glass">
            <div className="spatial-spinner" />
            <span>Scanning campus spatial database...</span>
          </div>
        ) : (
          <div className="spatial-items-grid">
            {lostItems.length > 0 ? (
              lostItems.map((item) => <ItemCard key={item._id} item={item} />)
            ) : (
              <GlassPanel elevation="subtle" className="empty-catalog-panel">
                <p>No lost items reported yet. Have you lost something?</p>
                <Link to="/report">
                  <GlassButton variant="primary" size="sm" style={{ marginTop: '0.75rem' }}>
                    + Report Lost Item
                  </GlassButton>
                </Link>
              </GlassPanel>
            )}
          </div>
        )}
      </section>

      {/* Recently Found Section */}
      <section className="spatial-catalog-section">
        <div className="spatial-section-header">
          <div>
            <h2 className="spatial-section-title">Recently Found Items</h2>
            <p className="spatial-section-sub">Recovered campus belongings waiting to be claimed</p>
          </div>
          <Link to="/found">
            <GlassButton variant="ghost" size="sm">
              View All ({foundItems.length}) →
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="spatial-loading-glass vision-glass">
            <div className="spatial-spinner" />
            <span>Loading recovered items...</span>
          </div>
        ) : (
          <div className="spatial-items-grid">
            {foundItems.length > 0 ? (
              foundItems.map((item) => <ItemCard key={item._id} item={item} />)
            ) : (
              <GlassPanel elevation="subtle" className="empty-catalog-panel">
                <p>No found items reported yet. Found an item on campus?</p>
                <Link to="/report">
                  <GlassButton variant="primary" size="sm" style={{ marginTop: '0.75rem' }}>
                    + Report Found Item
                  </GlassButton>
                </Link>
              </GlassPanel>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
