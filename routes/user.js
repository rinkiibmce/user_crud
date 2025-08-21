const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Session authentication middleware (for protected API endpoints)
function auth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Signup
router.post('/register', async (req, res) => {
  const { username, password, name, email } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashed, name, email });
    req.session.userId = user._id;
    req.session.user = user;
    res.json({ success: true });
  } catch (e) {
    res.json({ error: 'User already exists or error occurred.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.user = user;
    res.json({ success: true });
  } else {
    res.json({ error: 'Login failed.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// Get all users (protected)
router.get('/users', auth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get single user (for edit)
router.get('/user/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Edit user (protected)
router.post('/edit/:id', auth, async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(req.params.id, { name, email });
  res.json({ success: true });
});

// Delete user (protected)
router.post('/delete/:id', auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
