// routes/events.js
// CRUD for training events shown on the calendar.
//
// Public routes:
//   GET  /api/events        — list all events (calendar reads this)
//
// Protected routes (admin JWT required):
//   POST   /api/events      — create a new event
//   PUT    /api/events/:id  — update an event
//   DELETE /api/events/:id  — delete an event

const express     = require('express');
const Event       = require('../models/Event');
const requireAuth = require('../middleware/auth');
const router      = express.Router();

// ── GET /api/events (public) ─────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 }); // oldest date first
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/events (admin only) ────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const event = new Event(req.body);
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/events/:id (admin only) ─────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Event not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/events/:id (admin only) ──────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
