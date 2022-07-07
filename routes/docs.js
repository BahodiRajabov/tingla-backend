const router = require('express').Router();
const swagger = require('swagger-ui-express');
const docs = require('../docs');

// DOCS
router.use('/', swagger.serve, swagger.setup(docs));

module.exports = router;
