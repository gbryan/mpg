const models = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  let perPage = Math.min(req.query['perPage'] || 25, 25);
  perPage = Math.max(perPage, 1);
  const page = req.query.page || 1;
  const offset = page > 1 ? (page - 1) * perPage : 0;
  const queryOptions = {limit: perPage, offset};
  const filters = {};

  ['year', 'make', 'model'].forEach((key) => {
    const val = req.query[key];

    if (val) {
      filters[key] = val;
    }
  });

  if (Object.keys(filters).length > 0) {
    queryOptions.where = filters;
  }

  const vehicles = await models.vehicle.findAll(queryOptions);

  res.json({vehicles});
});

router.get('/makes', async (req, res) => {
  const makes = await getUniquesForAttr('make');

  res.json({makes});
});

router.get('/models', async (req, res) => {
  const vehicleModels = await getUniquesForAttr('model');

  res.json({models: vehicleModels});
});

async function getUniquesForAttr(attr) {
  const results = await models.vehicle.findAll({
    attributes: [attr],
    group: attr,
    order: [attr],
  });
  return results.map(v => {
    return v.get(attr);
  })
}

module.exports = router;
