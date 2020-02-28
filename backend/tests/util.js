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
  return models.vehicle.create(values);
}

module.exports = {
  generateVehicle
};
