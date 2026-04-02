// models/Attendee.js
// This defines what an "attendee" document looks like in MongoDB.
// Think of it as your database table schema.

const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, trim: true, lowercase: true },
    dob:          { type: String },                  // stored as ISO date string "YYYY-MM-DD"
    education:    { type: String, default: '' },
    county:       { type: String, required: true },
    phone:        { type: String, default: '' },
    trainingType: { type: String, required: true },
    heardFrom:    { type: String, required: true },
    heardOther:   { type: String, default: '' },
    comments:     { type: String, default: '' },
    eventId:      { type: String, default: '' },    // links to an Event document later
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// mongoose.model('Attendee', attendeeSchema) tells Mongoose:
//   "Store documents using this schema in the 'attendees' collection"
module.exports = mongoose.model('Attendee', attendeeSchema);
