const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const { validateId, validateProject } = require('../middleware/validate');

// GET all projects (supports optional ?userId= query)
router.get('/', projectsController.getAllProjects);

// GET project by ID
router.get('/:id', validateId, projectsController.getProjectById);

// POST create new project
router.post('/', validateProject, projectsController.createProject);

// PUT update project by ID
router.put('/:id', validateId, validateProject, projectsController.updateProject);

// DELETE project by ID
router.delete('/:id', validateId, projectsController.deleteProject);

module.exports = router;
