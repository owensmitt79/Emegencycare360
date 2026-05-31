import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import { logActivity } from '../utils/auditLogger.js';

const router = Router();

// Utility function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ── POST /api/auth/login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      await logActivity('LOGIN_FAILED', null, { email: email.toLowerCase().trim(), reason: 'User not found' }, req);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, reason: 'Incorrect password' }, req);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, reason: 'Email not verified' }, req);
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }

    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;

    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: user.role }, req);
    res.json({ token, record: userObject });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ── POST /api/auth/register ──────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, role } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const userExists = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (userExists) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userRole = role || 'patient';
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      full_name,
      phone: phone || '',
      role: userRole,
      is_verified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // If role is doctor, also create a Doctor profile
    if (userRole === 'doctor') {
      await Doctor.create({
        userId: user.id,
        specialization: 'General Practice', // default
        hospitalName: 'Independent',
      });
    }

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.full_name);
    } catch (emailErr) {
      console.error('Failed to send verification email on register:', emailErr);
    }

    await logActivity('USER_REGISTER', user.id, { email: user.email, role: user.role }, req);

    res.status(201).json({ 
      message: 'Registration successful! A verification link has been sent to your email. Please check your inbox.',
      record: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_verified: false
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ── POST /api/auth/verify-email ──────────────────────────────────
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
      return res.status(400).json({ error: 'Verification token has expired.' });
    }

    // Update user status
    user.is_verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    await logActivity('EMAIL_VERIFIED', user.id, { email: user.email }, req);

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Server error during email verification' });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Doctor, as: 'doctor' }]
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    res.json({ record: user });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

// ── POST /api/auth/logout ───────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// Doctor and Admin specific logins:
router.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { email: email.toLowerCase().trim(), role: 'doctor' },
      include: [{ model: Doctor, as: 'doctor' }]
    });
    if (!user || !(await user.matchPassword(password))) {
      await logActivity('LOGIN_FAILED', null, { email: email.toLowerCase().trim(), role: 'doctor', reason: 'Invalid doctor credentials' }, req);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!user.is_verified) {
      await logActivity('LOGIN_FAILED', user.id, { email: user.email, role: 'doctor', reason: 'Doctor email not verified' }, req);
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }
    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;
    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: 'doctor' }, req);
    res.json({ token, record: userObject });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase().trim(), role: 'admin' } });
    if (!user || !(await user.matchPassword(password))) {
      await logActivity('LOGIN_FAILED', null, { email: email.toLowerCase().trim(), role: 'admin', reason: 'Invalid admin credentials' }, req);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user.id, user.role);
    const userObject = user.toJSON();
    delete userObject.password;
    await logActivity('LOGIN_SUCCESS', user.id, { email: user.email, role: 'admin' }, req);
    res.json({ token, record: userObject });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
