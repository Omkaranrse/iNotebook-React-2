const jwt = require('jsonwebtoken');
const JWT_SECRET = 'omkarisagoodb$oy';

const fetchuser = (req, res, next) => {
  // Get the token from the header
  const token = req.header('auth-token');

  // If no token found, return unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access denied! Please provide a valid token.' });
  }

  try {
    // Verify the token
    const data = jwt.verify(token, JWT_SECRET);

    // Extract the user from the token and add it to the request object
    req.user = data.user;

    // Move to the next middleware
    next();
  } catch (error) {
    // If token is invalid, return error
    return res.status(401).json({ error: 'Invalid token!' });
  }
};

module.exports = fetchuser;
