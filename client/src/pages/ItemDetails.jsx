import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TiltCard } from '../components/spatial/TiltCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import { GlassInput } from '../components/spatial/GlassInput';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Compass,
  ArrowLeft,
  QrCode,
} from 'lucide-react';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getById(id);
      if (response.data && response.data.item) {
        setItem(response.data.item);
        setMatches(response.data.matches || []);
      } else {
        setItem(response.data);
      }
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

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimSuccess('');
    setSubmittingClaim(true);

    try {
      const res = await itemsAPI.submitClaim(id, { proofDescription, contactInfo });
      setClaimSuccess(res.data.message || 'Claim submitted successfully for review!');
      setItem(res.data.item);
      setProofDescription('');
      setContactInfo('');
      setShowClaimModal(false);
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleReviewClaim = async (claimId, newStatus) => {
    try {
      const res = await itemsAPI.reviewClaim(id, claimId, newStatus);
      setItem(res.data.item);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim');
    }
  };

  const isOwner = user && item && (item.postedBy?._id === user.id || item.postedBy === user.id);
  const hasUserClaimed = item?.claims?.some(
    (c) => c.claimant?._id === user?.id || c.claimant === user?.id
  );

  if (loading) {
    return (
      <div className="spatial-page-container">
        <div className="spatial-loading-glass vision-glass">
          <div className="spatial-spinner" />
          <span>Retrieving item details in 3D space...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="spatial-page-container">
        <GlassPanel elevation="default" style={{ textAlign: 'center' }}>
          <p>{error || 'Item not found in spatial registry.'}</p>
          <GlassButton variant="secondary" size="md" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Return Back
          </GlassButton>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="spatial-page-container">
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(-1)} className="spatial-back-btn gaze-target">
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>

      <div className="item-details-split-stage">
        {/* Left Column: 3D Media Stage */}
        <div className="details-media-column">
          <TiltCard maxTilt={5} scale={1.01} className="details-media-tilt">
            <div className="details-media-glass vision-glass-card">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="details-hero-image" />
              ) : (
                <div className="details-no-image-placeholder">
                  <span>No Photo Uploaded</span>
                </div>
              )}

              {/* Floating status & type capsule */}
              <div className="details-image-floating-capsule">
                <span className={`spatial-type-chip ${item.type === 'lost' ? 'chip-lost' : 'chip-found'}`}>
                  {item.type?.toUpperCase()}
                </span>
                <span className={`spatial-status-chip status-${item.status}`}>
                  {item.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </TiltCard>

          {/* Quick QR Generator Card */}
          <GlassPanel elevation="subtle" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.35rem' }}>
              Want to protect your gear?
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Generate printable QR Finder Tags for laptops and student badges.
            </p>
            <Link to="/qr-tags">
              <GlassButton variant="secondary" size="sm" icon={QrCode}>
                Open Tag Generator
              </GlassButton>
            </Link>
          </GlassPanel>
        </div>

        {/* Right Column: Details & Claim Operations */}
        <div className="details-content-column">
          <GlassPanel elevation="elevated" className="details-main-panel">
            <div className="details-title-row">
              <h1 className="spatial-page-title" style={{ margin: 0, fontSize: '2rem' }}>
                {item.title}
              </h1>
              {item.isVerified && (
                <span className="spatial-verified-pill" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <CheckCircle size={15} /> Verified
                </span>
              )}
            </div>

            {claimSuccess && (
              <div className="spatial-alert-pill alert-success" style={{ margin: '1rem 0' }}>
                <CheckCircle size={16} />
                <span>{claimSuccess}</span>
              </div>
            )}

            {claimError && (
              <div className="spatial-alert-pill alert-error" style={{ margin: '1rem 0' }}>
                <span>{claimError}</span>
              </div>
            )}

            {/* Metadata Badges Grid */}
            <div className="details-meta-grid">
              <div className="details-meta-cell">
                <Tag size={16} className="meta-icon" />
                <div>
                  <span className="meta-cell-label">Category</span>
                  <span className="meta-cell-val">{item.category}</span>
                </div>
              </div>

              <div className="details-meta-cell">
                <Compass size={16} className="meta-icon" />
                <div>
                  <span className="meta-cell-label">Campus Zone</span>
                  <span className="meta-cell-val">{item.campusZone || 'General Campus'}</span>
                </div>
              </div>

              <div className="details-meta-cell">
                <MapPin size={16} className="meta-icon" />
                <div>
                  <span className="meta-cell-label">Specific Spot</span>
                  <span className="meta-cell-val">{item.location}</span>
                </div>
              </div>

              <div className="details-meta-cell">
                <Calendar size={16} className="meta-icon" />
                <div>
                  <span className="meta-cell-label">Reported On</span>
                  <span className="meta-cell-val">{new Date(item.dateReported).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="details-meta-cell">
                <User size={16} className="meta-icon" />
                <div>
                  <span className="meta-cell-label">Reported By</span>
                  <span className="meta-cell-val">{item.postedBy?.name || 'Student'}</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div style={{ margin: '1.5rem 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Item Description
              </h3>
              <div className="details-desc-box">
                {item.description}
              </div>
            </div>

            {/* Anti-Fraud Security Question Box */}
            {item.secretQuestion && (
              <div className="anti-fraud-alert-glass">
                <div className="anti-fraud-title">
                  <ShieldAlert size={16} /> Anti-Fraud Security Question:
                </div>
                <div className="anti-fraud-body">&ldquo;{item.secretQuestion}&rdquo;</div>
              </div>
            )}

            {/* Claim This Item Action (for Non-owners on open Found items) */}
            {user && !isOwner && item.type === 'found' && item.status === 'open' && (
              <div className="claim-action-glass vision-glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      Is this your lost item?
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Submit confidential proof of ownership to claim it safely.
                    </p>
                  </div>

                  {!hasUserClaimed ? (
                    <GlassButton
                      variant="primary"
                      size="md"
                      icon={ShieldCheck}
                      onClick={() => setShowClaimModal(!showClaimModal)}
                    >
                      Claim This Item
                    </GlassButton>
                  ) : (
                    <span className="claim-submitted-chip">
                      ✓ Claim Under Review
                    </span>
                  )}
                </div>

                {showClaimModal && (
                  <form onSubmit={handleClaimSubmit} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="qr-form-label">
                        Provide Ownership Proof / Answer Security Question
                      </label>
                      <textarea
                        value={proofDescription}
                        onChange={(e) => setProofDescription(e.target.value)}
                        required
                        rows="3"
                        className="spatial-textarea"
                        placeholder="e.g. Unique scratches, stickers on the lid, serial number, background wallpaper, or keychain color..."
                      />
                    </div>

                    <GlassInput
                      id="contact"
                      label="Your Contact Info (Phone / WhatsApp)"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="+91 9876543210"
                    />

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <GlassButton type="submit" variant="primary" size="md" disabled={submittingClaim}>
                        {submittingClaim ? 'Submitting Proof...' : 'Submit Ownership Claim'}
                      </GlassButton>
                      <GlassButton type="button" variant="ghost" size="md" onClick={() => setShowClaimModal(false)}>
                        Cancel
                      </GlassButton>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Owner/Admin Claims Review Panel */}
            {(isOwner || isAdmin) && item.claims && item.claims.length > 0 && (
              <div style={{ marginTop: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                  Submitted Ownership Claims ({item.claims.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {item.claims.map((claim) => (
                    <div key={claim._id} className="claim-review-card vision-glass-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                          Claimant: {claim.claimant?.name || 'Student'} ({claim.claimant?.email || 'N/A'})
                        </span>
                        <span className={`spatial-status-chip status-${claim.status}`}>
                          {claim.status?.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        <strong>Proof:</strong> {claim.proofDescription}
                      </p>
                      {claim.contactInfo && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>
                          <strong>Contact:</strong> {claim.contactInfo}
                        </p>
                      )}
                      {claim.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                          <GlassButton
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleReviewClaim(claim._id, 'approved')}
                          >
                            ✓ Approve &amp; Match
                          </GlassButton>
                          <GlassButton
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => handleReviewClaim(claim._id, 'rejected')}
                          >
                            ✕ Reject
                          </GlassButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Status Lifecycle for Owner/Admin */}
            {(isOwner || isAdmin) && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Lifecycle Management
                </h4>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <GlassButton
                    type="button"
                    variant={item.status === 'open' ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={item.status === 'open'}
                    onClick={() => handleStatusChange('open')}
                  >
                    Open Post
                  </GlassButton>
                  <GlassButton
                    type="button"
                    variant={item.status === 'matched' ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={item.status === 'matched'}
                    onClick={() => handleStatusChange('matched')}
                  >
                    Mark Matched
                  </GlassButton>
                  <GlassButton
                    type="button"
                    variant={item.status === 'closed' ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={item.status === 'closed'}
                    onClick={() => handleStatusChange('closed')}
                  >
                    Mark Closed / Returned
                  </GlassButton>
                </div>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* Smart Jaccard Similarity Matches Grid */}
      {matches && matches.length > 0 && (
        <section style={{ marginTop: '3.5rem' }}>
          <div className="spatial-section-header">
            <div>
              <h2 className="spatial-section-title">
                <Sparkles size={22} style={{ color: 'var(--accent-blue)', marginRight: '8px' }} />
                Smart Auto-Matches ({matches.length})
              </h2>
              <p className="spatial-section-sub">
                Potential corresponding items computed using Jaccard Similarity Coefficient
              </p>
            </div>
          </div>

          <div className="spatial-items-grid">
            {matches.map((m) => (
              <div key={m.item._id} className="match-glass-card vision-glass-card">
                <div className="match-score-pill">
                  <Sparkles size={13} /> {m.score}% Similarity Match
                </div>
                <h3 className="match-item-title">{m.item.title}</h3>
                <p className="match-item-desc">{m.item.description}</p>
                <div className="match-meta-line">
                  <span>{m.item.category}</span>
                  <span>•</span>
                  <span>{m.item.location}</span>
                </div>
                <Link to={`/items/${m.item._id}`}>
                  <GlassButton variant="primary" size="sm" style={{ width: '100%', marginTop: '0.75rem' }}>
                    Inspect Prospective Match →
                  </GlassButton>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ItemDetails;
