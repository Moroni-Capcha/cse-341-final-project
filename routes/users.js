const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { validateId, validateUser } = require('../middleware/validate');

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by ID
router.get('/:id', validateId, usersController.getUserById);

// POST create new user
router.post('/', validateUser, usersController.createUser);

// PUT update user by ID
router.put('/:id', validateId, validateUser, usersController.updateUser);

// DELETE user by ID
router.delete('/:id', validateId, usersController.deleteUser);

module.exports = router;
