import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { TiltCard } from '../components/spatial/TiltCard';
import { GlassPanel } from '../components/spatial/GlassPanel';
import { GlassButton } from '../components/spatial/GlassButton';
import { GlassInput } from '../components/spatial/GlassInput';
import { HeroSpatialObject } from '../components/spatial/HeroSpatialObject';
import {
  LogIn,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Standard Password Login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Request OTP for Login
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await authAPI.sendOtp({
        email: formData.email,
        purpose: 'login',
      });

      setSuccess(res.data.message || `OTP code sent directly to your email (${formData.email}).`);
      setOtpSent(true);
      setTimer(60);
      setIsResendActive(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send login OTP.';
      const helpMsg = err.response?.data?.help ? ` (${err.response.data.help})` : '';
      setError(errMsg + helpMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend Login OTP
  const handleResendLoginOtp = async () => {
    if (!isResendActive) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await authAPI.sendOtp({
        email: formData.email,
        purpose: 'login',
      });
      setSuccess('A new login code has been sent to your email.');
      setTimer(60);
      setIsResendActive(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Login
  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.loginWithOtp({
        email: formData.email,
        otp,
      });

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spatial-page-container login-spatial-stage">
      {/* 3D Perspective Stage Layout */}
      <div className="login-stage-split">
        {/* Left Side: Hero 3D Spatial Artifact (Apple Vision Pro Reference) */}
        <div className="spatial-hero-artifact-wrapper">
          <HeroSpatialObject size={320} />
          <div className="hero-artifact-caption">
            <span className="caption-pill">
              <Sparkles size={14} /> visionOS Spatial Beacon
            </span>
            <p className="caption-text">
              Interactive 3D lost &amp; found network with real-time biometric &amp; OTP verification.
            </p>
          </div>
        </div>

        {/* Right Side: Main Frosted Glass Tilt Card */}
        <div className="login-card-spatial-wrapper">
          <TiltCard maxTilt={5} scale={1.015} className="login-tilt-panel">
            <GlassPanel elevation="elevated" className="login-glass-panel">
              {/* Top Compact Hero for Mobile/Laptop */}
              <div className="mobile-hero-object-anchor">
                <HeroSpatialObject size={140} />
              </div>

              {/* Layer 1: Floating Circular Icon Badge (translateZ 30px) */}
              <div className="spatial-layer-icon-badge">
                <div className="spatial-circular-halo">
                  <LogIn size={26} className="badge-icon-symbol" />
                </div>
              </div>

              {/* Layer 2: Big Bold Title (translateZ 25px) */}
              <div className="spatial-layer-heading">
                <h1 className="spatial-hero-title">Welcome Back</h1>
                <p className="spatial-subtitle">
                  Sign in to your frosted campus utility environment
                </p>
              </div>

              {/* Layer 3: Segmented Glass Toggle Capsule (translateZ 20px) */}
              <div className="spatial-segmented-capsule" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={loginMethod === 'otp'}
                  onClick={() => {
                    setLoginMethod('otp');
                    setError('');
                    setSuccess('');
                  }}
                  className={`segmented-pill-btn ${loginMethod === 'otp' ? 'segmented-active' : ''}`}
                >
                  <ShieldCheck size={16} />
                  <span>Real Email OTP</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={loginMethod === 'password'}
                  onClick={() => {
                    setLoginMethod('password');
                    setError('');
                    setSuccess('');
                    setOtpSent(false);
                  }}
                  className={`segmented-pill-btn ${loginMethod === 'password' ? 'segmented-active' : ''}`}
                >
                  <Lock size={16} />
                  <span>Password Login</span>
                </button>
              </div>

              {/* Notifications */}
              {error && (
                <div className="spatial-alert-pill alert-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="spatial-alert-pill alert-success">
                  <CheckCircle2 size={17} />
                  <span>{success}</span>
                </div>
              )}

              {/* Layer 4: Form Fields & Actions (translateZ 15px - 30px) */}
              {loginMethod === 'otp' ? (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleSendLoginOtp} className="spatial-form-body">
                      <GlassInput
                        id="email-otp"
                        type="email"
                        label="Registered Campus Email"
                        icon={Mail}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="eng24cs0150@dsu.edu.in"
                      />

                      <div className="spatial-layer-action">
                        <GlassButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={loading}
                          className="spatial-submit-pill"
                        >
                          {loading ? 'Sending Verification Code...' : 'Send OTP to My Inbox →'}
                        </GlassButton>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtpLogin} className="spatial-form-body">
                      <div className="otp-digit-wrapper">
                        <label className="otp-input-label">
                          <KeyRound size={16} /> Enter 6-Digit Code from Inbox
                        </label>
                        <input
                          type="text"
                          id="login-otp-code"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          maxLength={6}
                          placeholder="• • • • • •"
                          className="spatial-otp-input"
                          autoFocus
                        />
                      </div>

                      <div className="otp-resend-row">
                        <span className="resend-countdown-text">
                          {timer > 0 ? `Resend available in ${timer}s` : 'Did not receive code?'}
                        </span>
                        <button
                          type="button"
                          onClick={handleResendLoginOtp}
                          disabled={!isResendActive || loading}
                          className="resend-action-btn gaze-target"
                        >
                          <RefreshCw size={14} /> Resend OTP
                        </button>
                      </div>

                      <div className="spatial-layer-action">
                        <GlassButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={loading || otp.length < 6}
                          className="spatial-submit-pill"
                        >
                          {loading ? 'Verifying Code...' : 'Verify OTP & Enter Room'}
                        </GlassButton>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          setError('');
                        }}
                        className="spatial-back-btn gaze-target"
                      >
                        <ArrowLeft size={15} /> Change Email Address
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="spatial-form-body">
                  <GlassInput
                    id="email-pw"
                    type="email"
                    label="Campus Email"
                    icon={Mail}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="student@campus.edu.in"
                  />

                  <GlassInput
                    id="password-pw"
                    type="password"
                    label="Password"
                    icon={Lock}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••••••"
                  />

                  <div className="spatial-layer-action">
                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="spatial-submit-pill"
                    >
                      {loading ? 'Authenticating...' : 'Sign In with Password'}
                    </GlassButton>
                  </div>
                </form>
              )}

              {/* Bottom Footer Link */}
              <div className="spatial-card-footer">
                <span>New to Campus Lost &amp; Found?</span>
                <Link to="/register" className="spatial-footer-link gaze-target">
                  Register with Email OTP →
                </Link>
              </div>
            </GlassPanel>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};

export default Login;
