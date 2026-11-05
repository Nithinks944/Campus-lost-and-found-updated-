import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

const router = express.Router();

// Helper to generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. Send OTP for Registration or Login
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpPurpose = purpose === 'login' ? 'login' : 'register';

    const existingUser = await User.findOne({ email: cleanEmail });

    if (otpPurpose === 'register' && existingUser) {
      return res.status(400).json({ message: 'User already exists with this email. Please log in.' });
    }

    if (otpPurpose === 'login' && !existingUser) {
      return res.status(404).json({ message: 'No registered user found with this email. Please register first.' });
    }

    // Invalidate any existing OTPs for this email and purpose
    await Otp.deleteMany({ email: cleanEmail, purpose: otpPurpose });

    const otpCode = generateOtp();

    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      purpose: otpPurpose,
    });

    console.log(`\n========================================`);
    console.log(`[CAMPUS OTP] Generated for ${cleanEmail} (${otpPurpose}): ${otpCode}`);
    console.log(`========================================\n`);

    // Attempt real email dispatch via Nodemailer
    try {
      await sendOtpEmail(cleanEmail, otpCode, otpPurpose);
      res.json({
        success: true,
        message: `OTP code has been sent directly to your email (${cleanEmail}). Please check your inbox and spam folder.`,
      });
    } catch (mailError) {
      console.error('Mail delivery failure:', mailError.message);
      return res.status(500).json({
        message: `Email delivery failed: ${mailError.message}`,
        help: 'To send real emails to your inbox, please add your EMAIL_USER and EMAIL_PASS (Gmail App Password) into server/.env',
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error while processing OTP request' });
  }
});

// 2. Verify OTP & Complete Registration
router.post('/register-with-otp', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: 'All fields including OTP are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP
    const validOtp = await Otp.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      purpose: 'register',
    });

    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Check if user already registered in the meantime
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    // Create user
    const user = new User({
      name,
      email: cleanEmail,
      password,
      role: 'student',
    });

    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: cleanEmail, purpose: 'register' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Account verified and registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration with OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP registration' });
  }
});

// 3. Login with OTP (Passwordless / 2FA)
router.post('/login-with-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const validOtp = await Otp.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      purpose: 'login',
    });

    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete used OTP
    await Otp.deleteMany({ email: cleanEmail, purpose: 'login' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Logged in successfully via OTP',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('OTP login error:', error);
    res.status(500).json({ message: 'Server error during OTP login' });
  }
});

// 4. Standard Registration (Fallback)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email: cleanEmail,
      password,
      role: 'student',
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 5. Standard Password Login (Fallback)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
