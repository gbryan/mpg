'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    year: DataTypes.INTEGER,
    make: DataTypes.STRING(36),
    model: DataTypes.STRING(128),
    city_mpg_fuel1: DataTypes.INTEGER,
    city_mpg_fuel2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hwy_mpg_fuel1: DataTypes.INTEGER,
    hwy_mpg_fuel2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comb_mpg_fuel1: DataTypes.INTEGER,
    comb_mpg_fuel2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    co2_gpm_fuel1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    co2_gpm_fuel2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cylinders: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    displacement: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    drive: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    atv_type: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    fuel_type1: {
      type: DataTypes.STRING(36),
      default: ''
    },
    fuel_type2: {
      type: DataTypes.STRING(36),
      default: null
    },
    transmission: {
      type: DataTypes.STRING(128),
      default: ''
    },
    vehicle_class: {
      type: DataTypes.STRING(128),
      default: ''
    },
    kwh_100_miles: {
      type: DataTypes.FLOAT,
      default: null
    },
    comb_utility_factor: {
      type: DataTypes.FLOAT,
      default: null
    }
  }, {timestamps: false, tableName: 'vehicles'});
  Vehicle.associate = function (models) {
    // associations can be defined here
  };
  return Vehicle;
};
