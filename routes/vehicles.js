const models  = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const vehicles = await models.vehicle.findAll({limit: 25});

  res.json({vehicles});
});

module.exports = router;
