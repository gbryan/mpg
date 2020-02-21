var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

module.exports = router;
