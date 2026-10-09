const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// GET all users
const getAllUsers = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Retrieve all users from the database'
    #swagger.responses[200] = {
      description: 'List of users retrieved successfully',
      schema: [{ $ref: '#/definitions/User' }]
    }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const users = await db.collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET user by ID
const getUserById = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Retrieve a single user by MongoDB ObjectId'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = {
      description: 'User details',
      schema: { $ref: '#/definitions/User' }
    }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with ID ${id} was not found.`
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST create new user
const createUser = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Create a new user'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data to create',
      required: true,
      schema: { $ref: '#/definitions/UserInput' }
    }
    #swagger.responses[201] = { description: 'User created successfully' }
    #swagger.responses[400] = { description: 'Validation failed' }
    #swagger.responses[409] = { description: 'Username or email already exists' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const {
      username,
      email,
      firstName,
      lastName,
      bio = '',
      role = 'developer',
      skills = [],
      githubUrl = '',
      portfolioUrl = ''
    } = req.body;

    // Check for unique username or email
    const existingUser = await db.collection('users').findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }]
    });

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: 'A user with that username or email already exists.'
      });
    }

    const newUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim(),
      role: role.trim(),
      skills: Array.isArray(skills) ? skills : [],
      githubUrl: githubUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    if (result.acknowledged) {
      res.status(201).json({
        status: 201,
        message: 'User created successfully.',
        userId: result.insertedId
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'An error occurred while creating the user.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// PUT update user by ID
const updateUser = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update an existing user by ID'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data to update',
      required: true,
      schema: { $ref: '#/definitions/UserInput' }
    }
    #swagger.responses[200] = { description: 'User updated successfully' }
    #swagger.responses[400] = { description: 'Validation failed or invalid ID' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const {
      username,
      email,
      firstName,
      lastName,
      bio = '',
      role = 'developer',
      skills = [],
      githubUrl = '',
      portfolioUrl = ''
    } = req.body;

    const updatedUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim(),
      role: role.trim(),
      skills: Array.isArray(skills) ? skills : [],
      githubUrl: githubUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `User with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'User updated successfully.',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
};

// DELETE user by ID
const deleteUser = async (req, res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete a user by ID'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = { description: 'User deleted successfully' }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `User with ID ${id} was not found.`
      });
    }

    // Also cascade cleanup: delete projects belonging to this user
    await db.collection('projects').deleteMany({ userId: id });

    res.status(200).json({
      status: 200,
      message: 'User and associated projects deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
