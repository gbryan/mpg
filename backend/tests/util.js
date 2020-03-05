const models  = require('../models');

function generateVehicle(options) {
  const values = Object.assign({
    year: 2020,
    make: 'Honda',
    model: 'Civic',
    fuel_type1: 'Regular Gasoline',
    city_mpg_fuel1: 39,
    hwy_mpg_fuel1: 42,
  }, options);
  return models.Vehicle.create(values);
}

function generateZipCode(zipCode) {
  return models.ZipCode.create({zip_code: zipCode});
}

function generateGridSubregion(options) {
  const values = Object.assign({
    name: 'SERC Mississippi Valley',
    co2_lb_mwh: 839,
    ch4_lb_mwh: 0.05,
    n2o_lb_mwh: 0.007,
    co2e_lb_mwh: 842,
    nox_lb_mwh: 0.8,
    so2_lb_mwh: 0.712,
  }, options);
  return models.GridSubregion.create(values);
}

module.exports = {
  generateVehicle,
  generateZipCode,
  generateGridSubregion,
};
