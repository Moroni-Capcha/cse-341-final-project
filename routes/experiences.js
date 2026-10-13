const express = require('express');
const router = express.Router();
const experiencesController = require('../controllers/experiences');
const { validateId, validateExperience } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all experiences (supports optional ?userId= query)
router.get('/', experiencesController.getAllExperiences);

// GET experience by ID
router.get('/:id', validateId, experiencesController.getExperienceById);

// POST create new experience (Requires Authentication)
router.post('/', isAuthenticated, validateExperience, experiencesController.createExperience);

// PUT update experience by ID (Requires Authentication)
router.put('/:id', isAuthenticated, validateId, validateExperience, experiencesController.updateExperience);

// DELETE experience by ID (Requires Authentication)
router.delete('/:id', isAuthenticated, validateId, experiencesController.deleteExperience);

module.exports = router;

