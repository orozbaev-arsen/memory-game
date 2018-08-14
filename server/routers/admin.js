const express = require('express');
const app = require('../app');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(app.dir('../dist/index.html'));
});

module.exports = router;

