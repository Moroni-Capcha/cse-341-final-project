const { ObjectId } = require('mongodb');

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

// Validate 24-character MongoDB ObjectId
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !ObjectId.isValid(id) || String(new ObjectId(id)) !== id) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid ID format. Must be a 24-character hexadecimal string.'
    });
  }
  next();
};

// Validate User Payload for POST and PUT
const validateUser = (req, res, next) => {
  const { username, email, firstName, lastName, bio, role, skills, githubUrl, portfolioUrl } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errors.push('Field "username" is required and must be at least 3 characters.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Field "email" is required and must be a valid email address.');
  }

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push('Field "firstName" is required.');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push('Field "lastName" is required.');
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('Field "skills" must be an array of strings if provided.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed for User.',
      errors
    });
  }

  next();
};

// Validate Project Payload for POST and PUT
const validateProject = (req, res, next) => {
  const { title, description, userId, technologies, githubRepo, liveUrl, completed, featured } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Field "title" is required.');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Field "description" is required.');
  }

  if (!userId || !ObjectId.isValid(userId)) {
    errors.push('Field "userId" is required and must be a valid 24-character hex user ID.');
  }

  if (technologies !== undefined && !Array.isArray(technologies)) {
    errors.push('Field "technologies" must be an array of strings if provided.');
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Field "completed" must be a boolean if provided.');
  }

  if (featured !== undefined && typeof featured !== 'boolean') {
    errors.push('Field "featured" must be a boolean if provided.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed for Project.',
      errors
    });
  }

  next();
};

module.exports = {
  validateId,
  validateUser,
  validateProject
};
