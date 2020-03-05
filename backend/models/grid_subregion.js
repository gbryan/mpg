'use strict';
module.exports = (sequelize, DataTypes) => {
  const GridSubregion = sequelize.define('GridSubregion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    co2_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    ch4_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    n2o_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    co2e_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    nox_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
    so2_lb_mwh: {
      type: DataTypes.FLOAT(),
      allowNull: false,
    },
  }, {timestamps: false, tableName: 'grid_subregions'});
  GridSubregion.associate = function (models) {
    models.GridSubregion.belongsToMany(
      models.ZipCode,
      {
        through: 'zip_code_grid_subregions',
        foreignKey: 'grid_subregion_id',
        otherKey: 'zip_code_id',
        timestamps: false
      }
    );
  };
  return GridSubregion;
};
