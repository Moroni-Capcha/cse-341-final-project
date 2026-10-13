const express = require('express');
const router = express.Router();
const passport = require('passport');

// Swagger Documentation Route
router.use('/', require('./swagger'));

// API Collections
router.use('/users', require('./users'));
router.use('/projects', require('./projects'));
router.use('/experiences', require('./experiences'));
router.use('/contacts', require('./contacts'));

// GitHub OAuth Login Route
router.get(
  '/login',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Initiate GitHub OAuth login'
    #swagger.description = 'Redirects user to GitHub for authentication. For testing, open this route directly in your browser tab.'
  */
  passport.authenticate('github', { scope: ['user:email'] })
);

// Alias /auth/login
router.get('/auth/login', (req, res) => {
  /* #swagger.ignore = true */
  res.redirect('/login');
});

// GitHub OAuth Callback Route
router.get(
  '/github/callback',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'GitHub OAuth callback'
    #swagger.description = 'Callback URL for GitHub OAuth authentication.'
  */
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      res.redirect('/');
    });
  }
);

// Logout Route
router.get(
  '/logout',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Logout user'
    #swagger.description = 'Logs the user out and terminates the active session.'
  */
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  }
);

// Alias /auth/logout
router.get('/auth/logout', (req, res) => {
  /* #swagger.ignore = true */
  res.redirect('/logout');
});

// Authentication Status Endpoint (JSON)
router.get('/auth/status', (req, res) => {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get authentication status'
    #swagger.description = 'Returns JSON showing whether the client is authenticated and active user profile'
    #swagger.responses[200] = {
      description: 'Authentication state',
      schema: {
        authenticated: true,
        user: { username: 'octocat', displayName: 'The Octocat', id: '1' }
      }
    }
  */
  if (req.session && req.session.user !== undefined) {
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        displayName: req.session.user.displayName
      }
    });
  } else {
    res.status(200).json({
      authenticated: false,
      user: null
    });
  }
});

// Root Welcome Route with visual OAuth state display
router.get('/', (req, res) => {
  /* #swagger.ignore = true */
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    if (req.session && req.session.user !== undefined) {
      return res.send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #c8e6c9; background: #f1f8e9; border-radius: 8px;">
          <h2 style="color: #2e7d32; margin-top: 0;">&#10004; Logged in as ${req.session.user.displayName || req.session.user.username}</h2>
          <p>You have full administrative access to all Portfolio Builder API endpoints.</p>
          <div style="margin-top: 20px;">
            <a href="/api-docs" style="display: inline-block; padding: 10px 18px; background-color: #1976d2; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore Swagger API Docs</a>
            &nbsp;&nbsp;
            <a href="/logout" style="display: inline-block; padding: 10px 18px; background-color: #d32f2f; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Log Out</a>
          </div>
        </div>
      `);
    } else {
      return res.send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border: 1px solid #ffcdd2; background: #ffebee; border-radius: 8px;">
          <h2 style="color: #c62828; margin-top: 0;">&#128274; Logged Out</h2>
          <p>You are currently unauthenticated. Public GET routes and contact submission are accessible; administrative mutating endpoints require OAuth login.</p>
          <div style="margin-top: 20px;">
            <a href="/login" style="display: inline-block; padding: 10px 18px; background-color: #24292e; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign in with GitHub</a>
            &nbsp;&nbsp;
            <a href="/api-docs" style="display: inline-block; padding: 10px 18px; background-color: #1976d2; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore Swagger API Docs</a>
          </div>
        </div>
      `);
    }
  }

  res.status(200).json({
    message: 'Welcome to the Portfolio Builder API (CSE 341 Final Project)',
    authenticated: Boolean(req.session && req.session.user !== undefined),
    user: req.session && req.session.user ? (req.session.user.displayName || req.session.user.username) : null,
    documentation: '/api-docs',
    collections: {
      users: '/users',
      projects: '/projects',
      experiences: '/experiences',
      contacts: '/contacts'
    }
  });
});

module.exports = router;
