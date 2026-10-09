const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('./db/connect');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/', routes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Initialize DB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  }
});
