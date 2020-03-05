const models = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const zipCodeVal = req.query['zip_code'];

  if (!zipCodeVal) {
    res.status(400).json({error: 'You must specify a zip_code.'});
    return;
  }

  const respObj = {
    avgCo2eLbsMwh: null,
    gridSubregions: [],
  };

  const zipCode = await models.ZipCode.findOne({
    where: {zip_code: zipCodeVal},
    include: models.GridSubregion,
  });

  if (!zipCode) {
    res.json(respObj);
    return;
  }

  respObj.gridSubregions = zipCode.GridSubregions.map(g => {
    const formattedSubregion = Object.assign({}, g.dataValues);
    delete formattedSubregion.zip_code_grid_subregions;
    return formattedSubregion;
  });
  respObj.avgCo2eLbsMwh = respObj.gridSubregions
    .map(g => g.co2e_lb_mwh)
    .reduce((total, curr) => total + curr, 0) / respObj.gridSubregions.length;

  res.json(respObj);
});

module.exports = router;
