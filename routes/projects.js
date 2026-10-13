const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const { validateId, validateProject } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all projects (supports optional ?userId= query)
router.get('/', projectsController.getAllProjects);

// GET project by ID
router.get('/:id', validateId, projectsController.getProjectById);

// POST create new project (Requires Authentication)
router.post('/', isAuthenticated, validateProject, projectsController.createProject);

// PUT update project by ID (Requires Authentication)
router.put('/:id', isAuthenticated, validateId, validateProject, projectsController.updateProject);

// DELETE project by ID (Requires Authentication)
router.delete('/:id', isAuthenticated, validateId, projectsController.deleteProject);

module.exports = router;
