// models/Interest.js
// An "interest" is someone who wants to hear about a training class,
// but hasn't registered for a specific orientation yet (e.g. job fair sign-ups).
//
// We keep these in their OWN collection ("interests") instead of mixing them
// into "attendees" so attendee headcounts and CSV exports stay accurate.

const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, trim: true, lowercase: true },
    phone:        { type: String, required: true },
    address:      { type: String, required: true, trim: true },
    county:       { type: String, required: true },
    dob:          { type: String, default: '' },     // optional, "YYYY-MM-DD"
    education:    { type: String, required: true },
    trainingType: { type: String, required: true },  // the class they're interested in
    comments:     { type: String, default: '' },
    source:       { type: String, default: '' },     // where they found the form, e.g. "job-fair"
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('Interest', interestSchema);
