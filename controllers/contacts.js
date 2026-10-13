const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// GET all contact messages (supports optional ?userId= query)
const getAllContacts = async (req, res, next) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.description = 'Retrieve all contact inquiries, optionally filtered by userId (Requires Authentication)'
    #swagger.parameters['userId'] = {
      in: 'query',
      description: 'Filter contacts by user ID',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'List of contacts retrieved successfully',
      schema: [{ $ref: '#/definitions/Contact' }]
    }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const contacts = await db.collection('contacts').find(query).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

// GET contact message by ID
const getContactById = async (req, res, next) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.description = 'Retrieve a single contact message by MongoDB ObjectId (Requires Authentication)'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = {
      description: 'Contact message details',
      schema: { $ref: '#/definitions/Contact' }
    }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Contact message not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact message with ID ${id} was not found.`
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

// POST submit a new contact message (Public inquiry)
const createContact = async (req, res, next) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.description = 'Submit a new recruiter or visitor contact inquiry to a developer'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Contact inquiry payload',
      required: true,
      schema: { $ref: '#/definitions/ContactInput' }
    }
    #swagger.responses[201] = { description: 'Contact inquiry sent successfully' }
    #swagger.responses[400] = { description: 'Validation failed' }
    #swagger.responses[404] = { description: 'Target user not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const db = mongodb.getDb();
    const {
      userId,
      senderName,
      senderEmail,
      subject,
      message,
      read = false
    } = req.body;

    // Verify recipient user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot send contact message: Target user with ID ${userId} does not exist.`
      });
    }

    const newContact = {
      userId: userId.trim(),
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      read: Boolean(read),
      createdAt: new Date()
    };

    const result = await db.collection('contacts').insertOne(newContact);

    if (result.acknowledged) {
      res.status(201).json({
        status: 201,
        message: 'Contact inquiry sent successfully.',
        contactId: result.insertedId
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'An error occurred while saving the contact inquiry.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// PUT update contact message (e.g., mark as read/unread)
const updateContact = async (req, res, next) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.description = 'Update a contact inquiry record by ID (e.g., mark read) (Requires Authentication)'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Contact data to update',
      required: true,
      schema: { $ref: '#/definitions/ContactInput' }
    }
    #swagger.responses[200] = { description: 'Contact inquiry updated successfully' }
    #swagger.responses[400] = { description: 'Validation failed or invalid ID' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Contact message or target user not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();
    const {
      userId,
      senderName,
      senderEmail,
      subject,
      message,
      read = false
    } = req.body;

    // Verify recipient user exists
    const userExists = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        message: `Cannot update contact: Target user with ID ${userId} does not exist.`
      });
    }

    const updatedContact = {
      userId: userId.trim(),
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      read: Boolean(read),
      updatedAt: new Date()
    };

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedContact }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Contact message with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact inquiry updated successfully.',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
};

// DELETE contact message by ID
const deleteContact = async (req, res, next) => {
  /*
    #swagger.tags = ['Contacts']
    #swagger.description = 'Delete a contact inquiry record by ID (Requires Authentication)'
    #swagger.parameters['id'] = { description: '24-character hexadecimal MongoDB ObjectId' }
    #swagger.responses[200] = { description: 'Contact inquiry deleted successfully' }
    #swagger.responses[400] = { description: 'Invalid ID format' }
    #swagger.responses[401] = { description: 'Unauthorized' }
    #swagger.responses[404] = { description: 'Contact inquiry not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const { id } = req.params;
    const db = mongodb.getDb();

    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `Contact message with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact inquiry deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};

