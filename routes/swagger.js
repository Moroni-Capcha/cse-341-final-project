const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Serve Swagger UI with dynamic host detection (seamlessly works on localhost:8080 and Render)
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', (req, res, next) => {
  /* #swagger.ignore = true */
  const host = req.get('host') || swaggerDocument.host || 'localhost:8080';
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const doc = {
    ...swaggerDocument,
    host: host,
    schemes: protocol === 'https' ? ['https', 'http'] : ['http', 'https']
  };
  swaggerUi.setup(doc)(req, res, next);
});

module.exports = router;
