const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return callback(new Error('MONGODB_URI environment variable is missing. Check your .env file.'));
  }
  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db();
      console.log(`Connected to MongoDB database: ${_db.databaseName}`);
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized! Call initDb first.');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
