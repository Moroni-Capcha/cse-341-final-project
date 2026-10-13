const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// GET all experiences (supports optional ?userId= query)
const getAllExperiences = async (req, res, next) => {
  /*
    #swagger.tags = ['Experiences']
    #swagger.description = 'Retrieve all experiences, optionally filtered by userId'
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'Filter experiences by user ID',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'List of experiences retrieved successfully',
      schema: [{ $ref: '#/definitions/Experience' }]
    }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const experiences = await db.collection('experiences').find(query).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(experiences);
  } catch (err) {
    next(err);
  }
};

// GET experience by ID
const getExperienceById = async (req, res, next) => {
  /*
    #swagger.tags = ['Experiences']
    #swagger.description = 'Retrieve a single experience by MongoDB ObjectId'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = {
      description: 'Experience details',
      schema: { $ref: '#/definitions/Experience' }
    }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[404] = { description: 'Experience not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const experience = await db.collection('experiences').findOne({ _id: new ObjectId(id) });

    if (!experience) {
      return res.status(404).json({
        status: 404,
        message: `Experience with ID ${id} was not found.`
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(experience);
  } catch (err) {
    next(err);
  }
};

// POST create new experience
const createExperience = async (req, res, next) => {
  /*
    #swagger.tags = ['Experiences']
    #swagger.description = 'Create a new experience entry (Requires Authentication)'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Experience data to create',
      required: true,
      schema: { $ref: '#/definitions/ExperienceInput' }
    }
    #swagger.responses[201] = { description: 'Experience created successfully' }
    #swagger.responses[400] = { description: 'Validation failed' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Associated user not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const {
      userId,
      company,
      role,
      location = '',
      startDate,
      endDate = null,
      current = false,
      description,
      technologies = []
    } = req.body;

    // Verify associated user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot create experience: User with ID ${userId} does not exist.`
      });
    }

    const newExperience = {
      userId: userId.trim(),
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: endDate ? String(endDate).trim() : null,
      current: Boolean(current),
      description: description.trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('experiences').insertOne(newExperience);

    if (result.acknowledged) {
      res.status(201).json({
        status: 201,
        message: 'Experience created successfully.',
        experienceId: result.insertedId
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'An error occurred while creating the experience.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// PUT update experience by ID
const updateExperience = async (req, res, next) => {
  /*
    #swagger.tags = ['Experiences']
    #swagger.description = 'Update an existing experience by ID (Requires Authentication)'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Experience data to update',
      required: true,
      schema: { $ref: '#/definitions/ExperienceInput' }
    }
    #swagger.responses[200] = { description: 'Experience updated successfully' }
    #swagger.responses[400] = { description: 'Validation failed or invalid ID' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Experience or associated user not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const {
      userId,
      company,
      role,
      location = '',
      startDate,
      endDate = null,
      current = false,
      description,
      technologies = []
    } = req.body;

    // Verify associated user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot update experience: User with ID ${userId} does not exist.`
      });
    }

    const updatedExperience = {
      userId: userId.trim(),
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: endDate ? String(endDate).trim() : null,
      current: Boolean(current),
      description: description.trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      updatedAt: new Date()
    };

    const result = await db.collection('experiences').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedExperience }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Experience with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Experience updated successfully.',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
};

// DELETE experience by ID
const deleteExperience = async (req, res, next) => {
  /*
    #swagger.tags = ['Experiences']
    #swagger.description = 'Delete an experience by ID (Requires Authentication)'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = { description: 'Experience deleted successfully' }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Experience not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();

    const result = await db.collection('experiences').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Experience with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Experience deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
};

