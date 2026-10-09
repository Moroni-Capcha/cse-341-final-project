const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// GET all projects (supports optional ?userId= query)
const getAllProjects = async (req, res, next) => {
  /*
    #swagger.tags = ['Projects']
    #swagger.description = 'Retrieve all projects, optionally filtered by userId'
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'Filter projects by user ID',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'List of projects retrieved successfully',
      schema: [{ $ref: '#/definitions/Project' }]
    }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const projects = await db.collection('projects').find(query).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

// GET project by ID
const getProjectById = async (req, res, next) => {
  /*
    #swagger.tags = ['Projects']
    #swagger.description = 'Retrieve a single project by MongoDB ObjectId'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = {
      description: 'Project details',
      schema: { $ref: '#/definitions/Project' }
    }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[404] = { description: 'Project not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: `Project with ID ${id} was not found.`
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

// POST create new project
const createProject = async (req, res, next) => {
  /*
    #swagger.tags = ['Projects']
    #swagger.description = 'Create a new project'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Project data to create',
      required: true,
      schema: { $ref: '#/definitions/ProjectInput' }
    }
    #swagger.responses[201] = { description: 'Project created successfully' }
    #swagger.responses[400] = { description: 'Validation failed' }
    #swagger.responses[404] = { description: 'Associated user not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const {
      title,
      description,
      userId,
      technologies = [],
      githubRepo = '',
      liveUrl = '',
      completed = false,
      featured = false
    } = req.body;

    // Verify associated user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot create project: User with ID ${userId} does not exist.`
      });
    }

    const newProject = {
      title: title.trim(),
      description: description.trim(),
      userId: userId.trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      githubRepo: githubRepo.trim(),
      liveUrl: liveUrl.trim(),
      completed: Boolean(completed),
      featured: Boolean(featured),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('projects').insertOne(newProject);

    if (result.acknowledged) {
      res.status(201).json({
        status: 201,
        message: 'Project created successfully.',
        projectId: result.insertedId
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'An error occurred while creating the project.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// PUT update project by ID
const updateProject = async (req, res, next) => {
  /*
    #swagger.tags = ['Projects']
    #swagger.description = 'Update an existing project by ID'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Project data to update',
      required: true,
      schema: { $ref: '#/definitions/ProjectInput' }
    }
    #swagger.responses[200] = { description: 'Project updated successfully' }
    #swagger.responses[400] = { description: 'Validation failed or invalid ID' }
    #swagger.responses[404] = { description: 'Project not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const {
      title,
      description,
      userId,
      technologies = [],
      githubRepo = '',
      liveUrl = '',
      completed = false,
      featured = false
    } = req.body;

    // Verify associated user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot update project: User with ID ${userId} does not exist.`
      });
    }

    const updatedProject = {
      title: title.trim(),
      description: description.trim(),
      userId: userId.trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      githubRepo: githubRepo.trim(),
      liveUrl: liveUrl.trim(),
      completed: Boolean(completed),
      featured: Boolean(featured),
      updatedAt: new Date()
    };

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProject }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Project with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Project updated successfully.',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
};

// DELETE project by ID
const deleteProject = async (req, res, next) => {
  /*
    #swagger.tags = ['Projects']
    #swagger.description = 'Delete a project by ID'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = { description: 'Project deleted successfully' }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[404] = { description: 'Project not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();

    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Project with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Project deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
