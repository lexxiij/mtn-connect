// middleware/auth.js
// This is a "middleware" function — Express runs it BEFORE the route handler.
// Its job: check that the incoming request has a valid JWT token.
//
// How JWTs work (junior dev explanation):
//   1. Admin logs in → server gives them a signed "token" (a long encoded string)
//   2. Admin stores that token in localStorage (Angular does this)
//   3. Every future request to a protected route includes the token in the header
//   4. THIS middleware checks: "is this token legit?" — if yes, let them through

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // The token arrives in the Authorization header like:
  //   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  // Split "Bearer <token>" and grab just the token part
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify checks the token's signature and expiry using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach the decoded payload to the request for downstream use
    next();              // all good — continue to the actual route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = requireAuth;
