// routes/interests.js
// Interest-list sign-ups (people who want info about a class).
//
// Public:
//   POST   /api/interests       — anyone can submit the interest form
//
// Admin only (require JWT):
//   GET    /api/interests       — list all sign-ups, newest first
//   DELETE /api/interests/:id   — remove a sign-up

const express = require('express');
const Interest = require('../models/Interest');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Only these fields are accepted from the public form.
// "Whitelisting" like this stops someone from sneaking extra fields
// (like a fake createdAt) into the database by editing the request.
const ALLOWED_FIELDS = [
  'name', 'email', 'phone', 'address', 'county',
  'dob', 'education', 'trainingType', 'comments', 'source',
];

// ── POST /api/interests (public) ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    // Store phone as digits only, same as attendees, so it's easy to search/compare.
    if (data.phone) data.phone = String(data.phone).replace(/\D/g, '');

    // Note: unlike registrations, we do NOT block duplicate phone numbers here.
    // Someone might be interested in more than one class, and that's useful info.

    const saved = await new Interest(data).save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Error saving interest:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/interests (admin only) ──────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const interests = await Interest.find({}).sort({ createdAt: -1 });
    res.json(interests);
  } catch (err) {
    console.error('Error fetching interests:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/interests/:id (admin only) ───────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Interest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Sign-up not found.' });
    res.json({ message: 'Sign-up deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
