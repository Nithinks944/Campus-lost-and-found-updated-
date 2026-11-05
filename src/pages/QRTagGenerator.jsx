import React, { useState } from 'react';
import { TiltCard } from '../components/spatial/TiltCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import { GlassInput } from '../components/spatial/GlassInput';
import {
  QrCode,
  Printer,
  Download,
  Sparkles,
  Shield,
  Laptop,
  BookOpen,
  Key,
  Smartphone,
  HelpCircle,
  Tag,
} from 'lucide-react';

export const QRTagGenerator = () => {
  const [itemType, setItemType] = useState('Laptop');
  const [ownerName, setOwnerName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [rewardOffered, setRewardOffered] = useState('Treat / Token of Gratitude');

  const categories = [
    { name: 'Laptop', icon: Laptop },
    { name: 'Student ID Card', icon: Shield },
    { name: 'Backpack / Bag', icon: BookOpen },
    { name: 'Earbuds / Phone', icon: Smartphone },
    { name: 'Keys / Keychain', icon: Key },
    { name: 'Other Valuables', icon: HelpCircle },
  ];

  const targetScanUrl = `${window.location.origin}/report?foundItem=${encodeURIComponent(
    itemType
  )}&ownerTag=${encodeURIComponent(ownerName || 'Student')}&refEmail=${encodeURIComponent(contactEmail)}`;

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(
    targetScanUrl
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="spatial-page-container">
      {/* Title Header */}
      <div className="spatial-catalog-header">
        <div className="spatial-eyebrow-pill">
          <QrCode size={14} /> Preventative Security
        </div>
        <h1 className="spatial-page-title">Smart QR "Finder Tags"</h1>
        <p className="spatial-page-subtitle">
          Attach a frosted digital tag to your belongings. When scanned by any phone camera,
          finders can report it back to you instantly without revealing your personal number.
        </p>
      </div>

      <div className="qr-generator-split-stage">
        {/* Left: Configuration Form */}
        <GlassPanel elevation="default" className="qr-config-panel">
          <h2 className="qr-panel-title">
            <Tag size={18} style={{ color: 'var(--accent-blue)', marginRight: '6px' }} />
            1. Configure Tag Parameters
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="qr-form-label">Select Belonging Type</label>
            <div className="qr-category-selector-grid">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = itemType === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setItemType(c.name)}
                    className={`qr-category-btn gaze-target ${isSelected ? 'cat-selected' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <GlassInput
            id="ownerName"
            label="Your Name or Initials"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="e.g. Rahul S."
          />

          <GlassInput
            id="studentId"
            label="Roll No / Student ID (Optional)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 21CS045"
          />

          <GlassInput
            id="contactEmail"
            type="email"
            label="Alternate Notification Email (Optional)"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="student@campus.edu.in"
          />

          <GlassInput
            id="rewardOffered"
            label="Finder Appreciation Note"
            value={rewardOffered}
            onChange={(e) => setRewardOffered(e.target.value)}
            placeholder="e.g. Coffee treat on me!"
          />
        </GlassPanel>

        {/* Right: 3D Holographic Printable Badge Preview */}
        <div className="qr-preview-wrapper">
          <TiltCard maxTilt={7} scale={1.02} className="qr-preview-tilt">
            <div id="printable-badge" className="spatial-badge-card vision-glass-card">
              <div className="badge-header-capsule">
                <Sparkles size={13} /> CAMPUS SPATIAL TAG
              </div>

              <h3 className="badge-item-title">{itemType.toUpperCase()}</h3>

              {ownerName && (
                <div className="badge-owner-sub">
                  Owner: {ownerName} {studentId ? `(${studentId})` : ''}
                </div>
              )}

              {/* QR Code Container */}
              <div className="badge-qr-plate">
                <img src={qrApiUrl} alt="Scan QR Code" className="badge-qr-image" />
              </div>

              <div className="badge-instructions">
                <div className="instruction-heading">FOUND THIS ITEM? SCAN TO RETURN</div>
                <p className="instruction-body">
                  Scan with your phone camera to securely contact the owner through the Campus Lost &amp; Found network.
                </p>
              </div>

              {rewardOffered && (
                <div className="badge-reward-pill">
                  ★ Appreciation: {rewardOffered}
                </div>
              )}
            </div>
          </TiltCard>

          {/* Action Row */}
          <div className="qr-action-row">
            <GlassButton
              type="button"
              variant="primary"
              size="md"
              icon={Printer}
              onClick={handlePrint}
              style={{ flex: 1 }}
            >
              Print Finder Tag
            </GlassButton>

            <a
              href={qrApiUrl}
              download={`${itemType}-finder-tag.png`}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <GlassButton
                type="button"
                variant="secondary"
                size="md"
                icon={Download}
                style={{ width: '100%' }}
              >
                Download Image
              </GlassButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTagGenerator;
