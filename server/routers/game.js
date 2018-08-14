const app = require('../app');
const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(app.dir('../dist/index.html'));
});

// router.get('/play', (req, res, next) => {
// });

module.exports = router;
