/**
 * Authentication Middleware for CSE 341 Final Project
 * Verifies that the user has an active OAuth session before accessing protected routes.
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(401).json({
      status: 401,
      message: 'You do not have access. Please authenticate via /login first.'
    });
  }
  next();
};

module.exports = {
  isAuthenticated
};

