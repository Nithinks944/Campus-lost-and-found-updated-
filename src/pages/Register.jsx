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
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Info Form, 2 = OTP Code Verification
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP to User's Real Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await authAPI.sendOtp({
        email: formData.email,
        purpose: 'register',
      });

      setSuccess(res.data.message || `Verification code dispatched to ${formData.email}. Please check your inbox.`);
      setStep(2);
      setTimer(60);
      setIsResendActive(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send OTP to your email.';
      const helpMsg = err.response?.data?.help ? ` (${err.response.data.help})` : '';
      setError(errMsg + helpMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!isResendActive) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await authAPI.sendOtp({
        email: formData.email,
        purpose: 'register',
      });
      setSuccess('A new verification code has been dispatched to your email.');
      setTimer(60);
      setIsResendActive(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.registerWithOtp({
        ...formData,
        otp,
      });

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spatial-page-container login-spatial-stage">
      <div className="login-stage-split">
        {/* Left Side: Hero 3D Spatial Artifact */}
        <div className="spatial-hero-artifact-wrapper">
          <HeroSpatialObject size={340} />
          <div className="hero-artifact-caption">
            <span className="caption-pill">
              <Sparkles size={14} /> visionOS Campus Identity
            </span>
            <p className="caption-text">
              Join the spatial lost &amp; found network with real email OTP authentication.
            </p>
          </div>
        </div>

        {/* Right Side: Register Card */}
        <div className="login-card-spatial-wrapper">
          <TiltCard maxTilt={6} scale={1.015} className="login-tilt-panel">
            <GlassPanel elevation="elevated" className="login-glass-panel">
              {/* Mobile / Laptop compact 3D hero */}
              <div className="mobile-hero-object-anchor">
                <HeroSpatialObject size={140} />
              </div>

              {/* Circular Icon Badge */}
              <div className="spatial-layer-icon-badge">
                <div className="spatial-circular-halo">
                  <ShieldCheck size={28} className="badge-icon-symbol" />
                </div>
              </div>

              {/* Header Title */}
              <div className="spatial-layer-heading">
                <h1 className="spatial-hero-title">Create Account</h1>
                <p className="spatial-subtitle">
                  {step === 1
                    ? 'Register your student profile with email verification'
                    : `Enter the 6-digit code sent to ${formData.email}`}
                </p>
              </div>

              {/* Alerts */}
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

              {step === 1 ? (
                <form onSubmit={handleRequestOtp} className="spatial-form-body">
                  <GlassInput
                    id="name"
                    name="name"
                    label="Full Name"
                    icon={User}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                  />

                  <GlassInput
                    id="email"
                    name="email"
                    type="email"
                    label="Campus Email ID"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="student@campus.edu.in"
                  />

                  <GlassInput
                    id="password"
                    name="password"
                    type="password"
                    label="Choose Password"
                    icon={Lock}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />

                  <div className="spatial-layer-action">
                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="spatial-submit-pill"
                    >
                      {loading ? 'Sending Code...' : 'Proceed to Email OTP →'}
                    </GlassButton>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndRegister} className="spatial-form-body">
                  <div className="otp-digit-wrapper">
                    <label className="otp-input-label">
                      <KeyRound size={16} /> Enter 6-Digit Code from Inbox
                    </label>
                    <input
                      type="text"
                      id="reg-otp-code"
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
                      {timer > 0 ? `Resend code in ${timer}s` : 'Did not receive code?'}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
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
                      {loading ? 'Verifying...' : 'Verify OTP & Complete Account'}
                    </GlassButton>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                    }}
                    className="spatial-back-btn gaze-target"
                  >
                    <ArrowLeft size={15} /> Edit Email or Information
                  </button>
                </form>
              )}

              <div className="spatial-card-footer">
                <span>Already have an account?</span>
                <Link to="/login" className="spatial-footer-link gaze-target">
                  Sign in here →
                </Link>
              </div>
            </GlassPanel>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};

export default Register;
