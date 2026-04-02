// models/Event.js
// Stores training events that appear on the calendar.

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    date:        { type: String, required: true },   // "YYYY-MM-DD" format for FullCalendar
    description: { type: String, default: '' },
    location:    { type: String, default: '' },
    trainingType:{ type: String, default: '' },      // e.g. "CDL", "Forklift", "Shipyard Welding"
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
