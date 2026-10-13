const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const { validateId, validateContact } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all contact messages (Requires Authentication)
router.get('/', isAuthenticated, contactsController.getAllContacts);

// GET contact message by ID (Requires Authentication)
router.get('/:id', isAuthenticated, validateId, contactsController.getContactById);

// POST submit new contact inquiry (Public access with validation)
router.post('/', validateContact, contactsController.createContact);

// PUT update contact inquiry by ID (Requires Authentication)
router.put('/:id', isAuthenticated, validateId, validateContact, contactsController.updateContact);

// DELETE contact inquiry by ID (Requires Authentication)
router.delete('/:id', isAuthenticated, validateId, contactsController.deleteContact);

module.exports = router;

