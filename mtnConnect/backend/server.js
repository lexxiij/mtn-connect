require('dotenv').config(); // loads .env into process.env

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const path     = require('path'); // moved to top where all requires belong

// Import our route files
const attendeesRouter       = require('./routes/attendees');
const eventsRouter          = require('./routes/events');
const { router: authRouter, setAdminHash } = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
// cors() allows our Angular app (running on a different port/domain) to call this API.
// Without CORS the browser would block cross-origin requests for security reasons.
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // In production, set FRONTEND_URL to your Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// express.json() parses incoming requests with JSON bodies (req.body becomes usable)
app.use(express.json());

// ── ROUTES ───────────────────────────────────────────────────────────────────
// Every route defined in attendeesRouter will be prefixed with /api/attendees
app.use('/api/attendees', attendeesRouter);
app.use('/api/events',    eventsRouter);
app.use('/api/auth',      authRouter);

// Health check — useful for deployment platforms to verify the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── STATIC FILES ─────────────────────────────────────────────────────────────
// Serve the built Angular app. This must come AFTER all /api routes so that
// API calls are matched first, and only unmatched routes fall through to Angular.
app.use(express.static(path.join(__dirname, '../dist/mtn-connect/browser')));

// Catch-all: for any route that isn't an API route, send back index.html
// so Angular's client-side router can handle it (e.g. /login, /events, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/mtn-connect/browser/index.html'));
});

// ── STARTUP ───────────────────────────────────────────────────────────────────
async function startServer() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Hash the admin password from .env (bcrypt is a one-way hash)
    //    We do this at runtime so the .env can store a readable password,
    //    but it's never compared in plain text.
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    setAdminHash(hash); // pass the hash into the auth router
    console.log('✅ Admin credentials ready');

    // 3. Start listening for HTTP requests (all routes are already registered above)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1); // non-zero exit code signals an error to the OS
  }
}

startServer();
