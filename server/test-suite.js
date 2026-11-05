import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import adminRoutes from './routes/admin.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Otp from './models/Otp.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Server is running' }));

const TEST_PORT = 9099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}/api`;

let server;

// Helper to make fetch requests
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
};

const results = [];
const recordTest = (name, passed, details = '') => {
  results.push({ name, passed, details });
  const statusSymbol = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${statusSymbol}: ${name} ${details ? `(${details})` : ''}`);
};

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🚀 STARTING COMPREHENSIVE AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  try {
    // 1. Database Connection
    await mongoose.connect(process.env.MONGODB_URI);
    recordTest('Database Connection', true, 'MongoDB connected successfully');

    // Start ephemeral server
    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        resolve();
      });
    });
    recordTest('Server Boot', true, `Express running on port ${TEST_PORT}`);

    // Test Data
    const testEmail = `test.student.${Date.now()}@dsu.edu.in`;
    const testPassword = 'Password@123';
    const testName = 'Test Student DSU';
    let userToken = null;
    let userId = null;
    let testItemId = null;

    // -------------------------------------------------------------------------
    // TEST GROUP 1: HEALTH & SYSTEM DIAGNOSTICS
    // -------------------------------------------------------------------------
    console.log('\n--- Group 1: Health & Diagnostics ---');
    {
      const res = await request('/health');
      recordTest('GET /api/health responds with status ok', res.status === 200 && res.data?.status === 'ok');
    }

    // -------------------------------------------------------------------------
    // TEST GROUP 2: OTP GENERATION & SECURITY
    // -------------------------------------------------------------------------
    console.log('\n--- Group 2: OTP Verification & Auth Lifecycle ---');
    {
      // Case 2.1: Missing email
      const res = await request('/auth/send-otp', {
        method: 'POST',
        body: { purpose: 'register' },
      });
      recordTest('POST /api/auth/send-otp rejects missing email (400)', res.status === 400);
    }

    {
      // Case 2.2: Send OTP for login when user does not exist
      const res = await request('/auth/send-otp', {
        method: 'POST',
        body: { email: 'nonexistent.user@dsu.edu.in', purpose: 'login' },
      });
      recordTest('POST /api/auth/send-otp rejects login for non-existent user (404)', res.status === 404);
    }

    {
      // Case 2.3: Generate valid OTP for registration
      // To test without waiting on external SMTP timeouts, insert/retrieve OTP directly
      const cleanEmail = testEmail.toLowerCase().trim();
      await Otp.deleteMany({ email: cleanEmail });
      const testOtp = '849201';
      await Otp.create({
        email: cleanEmail,
        otp: testOtp,
        purpose: 'register',
      });
      recordTest('OTP Record creation in Database', true, `Stored OTP: ${testOtp} for ${cleanEmail}`);

      // Case 2.4: Register with invalid OTP
      const resInvalid = await request('/auth/register-with-otp', {
        method: 'POST',
        body: {
          name: testName,
          email: testEmail,
          password: testPassword,
          otp: '000000',
        },
      });
      recordTest('POST /api/auth/register-with-otp rejects wrong OTP (400)', resInvalid.status === 400);

      // Case 2.5: Register with valid OTP
      const resValid = await request('/auth/register-with-otp', {
        method: 'POST',
        body: {
          name: testName,
          email: testEmail,
          password: testPassword,
          otp: testOtp,
        },
      });
      const passed = resValid.status === 201 && !!resValid.data?.token;
      if (passed) {
        userToken = resValid.data.token;
        userId = resValid.data.user.id;
      }
      recordTest('POST /api/auth/register-with-otp creates user & returns JWT (201)', passed);

      // Case 2.6: Replay attack prevention (reusing used OTP)
      const resReplay = await request('/auth/register-with-otp', {
        method: 'POST',
        body: {
          name: testName,
          email: testEmail,
          password: testPassword,
          otp: testOtp,
        },
      });
      recordTest('POST /api/auth/register-with-otp prevents OTP replay (400)', resReplay.status === 400);

      // Case 2.7: Prevent duplicate registration with same email
      const resDuplicate = await request('/auth/register', {
        method: 'POST',
        body: {
          name: testName,
          email: testEmail,
          password: testPassword,
        },
      });
      recordTest('POST /api/auth/register rejects duplicate email (400)', resDuplicate.status === 400);
    }

    // -------------------------------------------------------------------------
    // TEST GROUP 3: PASSWORDLESS OTP LOGIN & PASSWORD LOGIN
    // -------------------------------------------------------------------------
    console.log('\n--- Group 3: Login Workflows (OTP & Password) ---');
    {
      const cleanEmail = testEmail.toLowerCase().trim();
      const loginOtp = '512390';
      await Otp.deleteMany({ email: cleanEmail, purpose: 'login' });
      await Otp.create({
        email: cleanEmail,
        otp: loginOtp,
        purpose: 'login',
      });

      // Case 3.1: Login with wrong OTP
      const resBadOtp = await request('/auth/login-with-otp', {
        method: 'POST',
        body: { email: testEmail, otp: '999999' },
      });
      recordTest('POST /api/auth/login-with-otp rejects incorrect code (400)', resBadOtp.status === 400);

      // Case 3.2: Login with correct OTP
      const resGoodOtp = await request('/auth/login-with-otp', {
        method: 'POST',
        body: { email: testEmail, otp: loginOtp },
      });
      recordTest('POST /api/auth/login-with-otp logs in user with token (200)', resGoodOtp.status === 200 && !!resGoodOtp.data?.token);

      // Case 3.3: One-time use verification
      const resUsedOtp = await request('/auth/login-with-otp', {
        method: 'POST',
        body: { email: testEmail, otp: loginOtp },
      });
      recordTest('POST /api/auth/login-with-otp deletes OTP after single use (400)', resUsedOtp.status === 400);

      // Case 3.4: Standard Password Login with correct password
      const resPassGood = await request('/auth/login', {
        method: 'POST',
        body: { email: testEmail, password: testPassword },
      });
      recordTest('POST /api/auth/login verifies bcrypt password (200)', resPassGood.status === 200 && !!resPassGood.data?.token);

      // Case 3.5: Standard Password Login with wrong password
      const resPassBad = await request('/auth/login', {
        method: 'POST',
        body: { email: testEmail, password: 'WrongPassword999' },
      });
      recordTest('POST /api/auth/login rejects incorrect password (401)', resPassBad.status === 401);
    }

    // -------------------------------------------------------------------------
    // TEST GROUP 4: CAMPUS RADAR & ZONE STATISTICS
    // -------------------------------------------------------------------------
    console.log('\n--- Group 4: Campus Radar Hotspot Analytics ---');
    {
      const res = await request('/items/stats/zones');
      const isArray = Array.isArray(res.data);
      const hasZones = isArray && res.data.length >= 8 && res.data.some(z => z.zone === 'Central Library');
      recordTest('GET /api/items/stats/zones returns 8 campus zones with lost/found metrics', res.status === 200 && hasZones);
    }

    // -------------------------------------------------------------------------
    // TEST GROUP 5: ITEM CREATION, FILTERING & CLAIMS
    // -------------------------------------------------------------------------
    console.log('\n--- Group 5: Item Management & Ownership Protection ---');
    {
      // Case 5.1: Create item without authentication token
      const resUnauth = await request('/items', {
        method: 'POST',
        body: {
          title: 'Unauthenticated Item',
          description: 'Should fail',
          type: 'lost',
          category: 'Electronics',
          location: 'Library',
        },
      });
      recordTest('POST /api/items requires JWT authorization (401)', resUnauth.status === 401);

      // Case 5.2: Create a Lost Item with token
      const resLost = await request('/items', {
        method: 'POST',
        token: userToken,
        body: {
          title: 'Space Grey MacBook Pro M2',
          description: 'Left on 2nd floor desk near window with blue sticker on lid',
          type: 'lost',
          category: 'Electronics',
          location: 'Central Library, 2nd Floor',
          campusZone: 'Central Library',
          secretQuestion: 'What color is the sticker on the back?',
          dateLostOrFound: new Date(),
        },
      });
      const lostCreated = resLost.status === 201 && (!!resLost.data?.item?._id || !!resLost.data?._id);
      recordTest('POST /api/items creates lost item with zone & secret question (201)', lostCreated);

      // Case 5.3: Create a Found Item with token
      const resFound = await request('/items', {
        method: 'POST',
        token: userToken,
        body: {
          title: 'Titan Fastrack Digital Watch',
          description: 'Black strap sports watch found on running track bench',
          type: 'found',
          category: 'Accessories',
          location: 'Sports Complex track',
          campusZone: 'Sports Complex & Gym',
          secretQuestion: 'What initials are engraved on the buckle?',
          dateLostOrFound: new Date(),
        },
      });
      const foundItemCreated = resFound.status === 201 && (!!resFound.data?.item?._id || !!resFound.data?._id);
      if (foundItemCreated) {
        testItemId = resFound.data?.item?._id || resFound.data?._id;
      }
      recordTest('POST /api/items creates found item in Sports Complex zone (201)', foundItemCreated);

      // Case 5.4: Fetch all items
      const resAll = await request('/items');
      recordTest('GET /api/items returns populated list of campus items (200)', resAll.status === 200 && Array.isArray(resAll.data));

      // Case 5.5: Filter items by type=lost
      const resFilterLost = await request('/items?type=lost');
      const allLost = Array.isArray(resFilterLost.data) && resFilterLost.data.every(i => i.type === 'lost');
      recordTest('GET /api/items?type=lost filters exclusively lost items (200)', resFilterLost.status === 200 && allLost);

      // Case 5.6: Filter items by type=found
      const resFilterFound = await request('/items?type=found');
      const allFound = Array.isArray(resFilterFound.data) && resFilterFound.data.every(i => i.type === 'found');
      recordTest('GET /api/items?type=found filters exclusively found items (200)', resFilterFound.status === 200 && allFound);

      // Case 5.7: Get Item Details by ID
      if (testItemId) {
        const resDetail = await request(`/items/${testItemId}`);
        const detailMatches = resDetail.status === 200 && (resDetail.data?._id === testItemId || resDetail.data?.item?._id === testItemId);
        recordTest('GET /api/items/:id fetches item details & matches (200)', detailMatches);

        // Case 5.8: Poster cannot claim their own item
        const resSelfClaim = await request(`/items/${testItemId}/claim`, {
          method: 'POST',
          token: userToken,
          body: {
            proofDescription: 'I lost this watch',
            contactInfo: testEmail,
          },
        });
        recordTest('POST /api/items/:id/claim prevents poster from claiming own post (400)', resSelfClaim.status === 400);

        // Case 5.9: Another student claims the item with proof
        const claimantEmail = `claimant.${Date.now()}@dsu.edu.in`;
        const claimantUser = new User({
          name: 'Claimant Student',
          email: claimantEmail,
          password: 'Password@123',
          role: 'student',
        });
        await claimantUser.save();
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
        const jwt = (await import('jsonwebtoken')).default;
        const claimantToken = jwt.sign({ id: claimantUser._id }, jwtSecret, { expiresIn: '1d' });

        const resClaim = await request(`/items/${testItemId}/claim`, {
          method: 'POST',
          token: claimantToken,
          body: {
            proofDescription: 'Purchased on Amazon in 2024, invoice attached. Buckle initials: N.K.',
            contactInfo: claimantEmail,
          },
        });
        recordTest('POST /api/items/:id/claim submits ownership proof from another student (201)', resClaim.status === 201);

        // Clean up claimant
        await User.findByIdAndDelete(claimantUser._id);
      }
    }

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log('\n--- Cleanup ---');
    if (userId) {
      await User.findByIdAndDelete(userId);
      await Otp.deleteMany({ email: testEmail });
      console.log('🧹 Cleaned up temporary test user and OTP records');
    }
    if (testItemId) {
      await Item.findByIdAndDelete(testItemId);
      console.log('🧹 Cleaned up temporary test item');
    }

  } catch (err) {
    console.error('💥 Test execution error:', err);
    recordTest('Test Runner Execution', false, err.message);
  } finally {
    if (server) {
      await new Promise(r => server.close(r));
    }
    await mongoose.disconnect();
    console.log('\n======================================================');
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    console.log(`📊 TEST SUITE SUMMARY: ${passedCount} / ${totalCount} PASSED (${Math.round((passedCount/totalCount)*100)}%)`);
    console.log('======================================================\n');
    process.exit(passedCount === totalCount ? 0 : 1);
  }
}

runTestSuite();
