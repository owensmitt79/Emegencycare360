import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';

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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);
    const userObject = user.toObject();
    delete userObject.password;

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

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userRole = role || 'patient';
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      full_name,
      phone: phone || '',
      role: userRole,
    });

    // If role is doctor, also create a Doctor profile
    if (userRole === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: 'General Practice', // default, to be updated later
        hospitalName: 'Independent',
      });
    }

    const token = generateToken(user._id, user.role);
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({ token, record: userObject });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
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
    
    const user = await User.findById(decoded.id).select('-password');
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
  // With stateless JWT, logout is usually handled client-side by deleting the token.
  // We can just return success here.
  res.json({ message: 'Logged out successfully.' });
});

// Doctor and Admin specific logins can be routed to the same login endpoint now,
// but for backward compatibility with the frontend:

router.post('/doctor/login', async (req, res) => {
  req.body.role = 'doctor';
  // Just use the main login logic, the frontend might be relying on this route
  // In a real app we'd verify the role matches
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'doctor' });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user._id, user.role);
    const userObject = user.toObject();
    delete userObject.password;
    res.json({ token, record: userObject });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user._id, user.role);
    const userObject = user.toObject();
    delete userObject.password;
    res.json({ token, record: userObject });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
