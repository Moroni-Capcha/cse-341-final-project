const express = require('express');
const router = express.Router();

// Swagger Documentation Route
router.use('/', require('./swagger'));

// API Collections
router.use('/users', require('./users'));
router.use('/projects', require('./projects'));

// Root Welcome Route
router.get('/', (req, res) => {
  /* #swagger.ignore = true */
  res.status(200).json({
    message: 'Welcome to the Portfolio Builder API (CSE 341 Final Project)',
    documentation: '/api-docs',
    collections: {
      users: '/users',
      projects: '/projects'
    }
  });
});

module.exports = router;
