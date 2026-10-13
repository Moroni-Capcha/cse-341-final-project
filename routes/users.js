const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { validateId, validateUser } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by ID
router.get('/:id', validateId, usersController.getUserById);

// POST create new user (Public registration)
router.post('/', validateUser, usersController.createUser);

// PUT update user by ID (Requires Authentication)
router.put('/:id', isAuthenticated, validateId, validateUser, usersController.updateUser);

// DELETE user by ID (Requires Authentication)
router.delete('/:id', isAuthenticated, validateId, usersController.deleteUser);

module.exports = router;
