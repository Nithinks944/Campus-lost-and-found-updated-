import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { TiltCard } from '../components/spatial/TiltCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import {
  MapPin,
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const CampusRadar = () => {
  const [zoneStats, setZoneStats] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  const zones = [
    {
      name: 'Central Library',
      desc: 'Silent study halls, computer labs, reference stacks & desks.',
      color: 'blue',
      hotspotLevel: 'High',
      icon: '📚',
    },
    {
      name: 'Engineering / Tech Block',
      desc: 'Classrooms, coding laboratories, seminar halls & cabins.',
      color: 'purple',
      hotspotLevel: 'Critical',
      icon: '💻',
    },
    {
      name: 'Cafeteria / Food Court',
      desc: 'Main dining area, juice bars, student lounge & outdoor tables.',
      color: 'amber',
      hotspotLevel: 'Very High',
      icon: '☕',
    },
    {
      name: 'Sports Complex & Gym',
      desc: 'Basketball courts, indoor badminton, gymnasium & lockers.',
      color: 'green',
      hotspotLevel: 'Medium',
      icon: '🏀',
    },
    {
      name: 'Main Auditorium',
      desc: 'Event venue, cultural stage, backstage & guest seating.',
      color: 'pink',
      hotspotLevel: 'Low',
      icon: '🎭',
    },
    {
      name: 'Student Hostels',
      desc: 'Hostel mess, reception desks, corridors & common rooms.',
      color: 'indigo',
      hotspotLevel: 'Medium',
      icon: '🏢',
    },
    {
      name: 'Main Entrance Gate',
      desc: 'Security checkpoint, bus stop shelter & visitor lobby.',
      color: 'teal',
      hotspotLevel: 'Low',
      icon: '🚪',
    },
    {
      name: 'General Campus Area',
      desc: 'Walkways, parking lots, garden lawns & amphitheatre.',
      color: 'slate',
      hotspotLevel: 'Medium',
      icon: '🌲',
    },
  ];

  useEffect(() => {
    fetchZoneStats();
  }, []);

  const fetchZoneStats = async () => {
    try {
      setLoading(true);
      const res = await itemsAPI.getZoneStats();
      setZoneStats(res.data);
    } catch (err) {
      console.error('Failed to load zone statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStat = (zoneName) => {
    return zoneStats.find((s) => s.zone === zoneName) || { lostCount: 0, foundCount: 0, total: 0 };
  };

  const totalLostAcrossCampus = zoneStats.reduce((sum, z) => sum + z.lostCount, 0);
  const totalFoundAcrossCampus = zoneStats.reduce((sum, z) => sum + z.foundCount, 0);

  return (
    <div className="spatial-page-container">
      {/* VisionOS Floating Radar Banner */}
      <GlassPanel elevation="elevated" className="spatial-radar-hero-panel">
        <div className="radar-hero-header">
          <div className="radar-icon-beacon">
            <Compass size={32} />
          </div>
          <div>
            <div className="spatial-eyebrow-pill" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={14} /> Real-Time Spatial Radar
            </div>
            <h1 className="spatial-page-title" style={{ margin: 0 }}>Campus Hotspot Radar</h1>
          </div>
        </div>

        <p className="spatial-page-subtitle" style={{ margin: '1rem 0 1.5rem', maxWidth: '800px' }}>
          Spatial incident intelligence monitoring misplacement frequencies and recovery density
          across all zones of the campus.
        </p>

        {/* Global Summary Metrics */}
        <div className="radar-metrics-row">
          <div className="radar-stat-capsule stat-lost">
            <span className="stat-label">Active Lost Items</span>
            <span className="stat-number">{totalLostAcrossCampus}</span>
          </div>

          <div className="radar-stat-capsule stat-found">
            <span className="stat-label">Recovered Items</span>
            <span className="stat-number">{totalFoundAcrossCampus}</span>
          </div>

          <div className="radar-stat-capsule stat-zones">
            <span className="stat-label">Monitored Zones</span>
            <span className="stat-number">{zones.length}</span>
          </div>
        </div>
      </GlassPanel>

      {/* Grid of Campus Zones with 3D Tilt */}
      <div className="spatial-section-header" style={{ marginTop: '2.5rem' }}>
        <div>
          <h2 className="spatial-section-title">
            <Layers size={22} style={{ color: 'var(--accent-blue)', marginRight: '8px' }} />
            Campus Zone Density Map
          </h2>
          <p className="spatial-section-sub">Hover on any zone for 3D depth and instant filtering</p>
        </div>
      </div>

      <div className="radar-zones-grid">
        {zones.map((zone) => {
          const stat = getStat(zone.name);
          const isSelected = selectedZone === zone.name;

          return (
            <TiltCard key={zone.name} maxTilt={6} scale={1.02} className="radar-zone-tilt">
              <div
                onClick={() => setSelectedZone(isSelected ? null : zone.name)}
                className={`radar-zone-card vision-glass-card ${isSelected ? 'zone-selected' : ''}`}
              >
                <div className="zone-card-top">
                  <span className="zone-emoji-orb">{zone.icon}</span>
                  <div className="zone-title-block">
                    <h3 className="zone-name-title">{zone.name}</h3>
                    <span className={`zone-hotspot-pill level-${zone.hotspotLevel.toLowerCase().replace(' ', '-')}`}>
                      {zone.hotspotLevel} Activity
                    </span>
                  </div>
                </div>

                <p className="zone-desc-text">{zone.desc}</p>

                {/* Micro Stat Split */}
                <div className="zone-stat-split">
                  <div className="zone-sub-count count-lost">
                    <span className="count-label">Lost</span>
                    <span className="count-val">{stat.lostCount}</span>
                  </div>
                  <div className="zone-sub-count count-found">
                    <span className="count-label">Found</span>
                    <span className="count-val">{stat.foundCount}</span>
                  </div>
                </div>

                {/* Action Links */}
                <div className="zone-card-actions">
                  <Link
                    to={`/lost?campusZone=${encodeURIComponent(zone.name)}`}
                    className="zone-filter-link gaze-target"
                  >
                    <span>View Items</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/report?zone=${encodeURIComponent(zone.name)}`}
                    className="zone-report-link gaze-target"
                  >
                    + Report in Zone
                  </Link>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
};

export default CampusRadar;
