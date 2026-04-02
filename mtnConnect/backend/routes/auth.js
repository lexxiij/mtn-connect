// routes/auth.js
// Handles admin login.
// POST /api/auth/login  → checks username/password, returns a JWT

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

// ----- SIMPLE ADMIN CREDENTIALS -----
// For a production app you'd store admins in the database.
// For now, we read one admin from environment variables.
// The password in .env is plain text; we HASH it once at server startup (see server.js)
// so bcrypt.compare() works properly.

let adminPasswordHash = null; // set by server.js after startup

// server.js calls this to inject the hashed password
function setAdminHash(hash) {
  adminPasswordHash = hash;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check username
  if (username !== process.env.ADMIN_USERNAME) {
    // Return same generic message whether username or password is wrong
    // (security best practice — don't hint which one failed)
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password against the bcrypt hash
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Issue a JWT token valid for 8 hours
  const token = jwt.sign(
    { username: process.env.ADMIN_USERNAME, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

module.exports = { router, setAdminHash };
