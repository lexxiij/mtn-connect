// routes/attendees.js
// Full CRUD for attendee registrations.
//
// Public routes (no auth required):
//   POST   /api/attendees        — submit a registration (anyone can register)
//
// Protected routes (require admin JWT):
//   GET    /api/attendees        — list all attendees
//   GET    /api/attendees/:id    — get one attendee by ID
//   PUT    /api/attendees/:id    — update an attendee
//   DELETE /api/attendees/:id    — delete an attendee

const express = require('express');
const Attendee = require('../models/Attendee');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// ── POST /api/attendees (public) ─────────────────────────────────────────────
// Anyone can submit a registration form.
router.post('/', async (req, res) => {
  try {
    // req.body contains the JSON sent from the Angular form
    const attendee = new Attendee(req.body);

    const saved = await attendee.save();
    res.status(201).json(saved);
  } catch (err) {
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Error saving attendee:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/attendees (admin only) ──────────────────────────────────────────
// requireAuth is added as a second argument — Express runs it first
router.get('/', requireAuth, async (req, res) => {
  try {
    // .find({}) = "give me all documents"; -1 = newest first
    const attendees = await Attendee.find({}).sort({ createdAt: -1 });
    res.json(attendees);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/attendees/:id (admin only) ──────────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) return res.status(404).json({ message: 'Attendee not found.' });
    res.json(attendee);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/attendees/:id (admin only) ──────────────────────────────────────
// Updates any fields sent in req.body; { new: true } returns the updated doc
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Attendee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Attendee not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/attendees/:id (admin only) ───────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Attendee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Attendee not found.' });
    res.json({ message: 'Attendee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
