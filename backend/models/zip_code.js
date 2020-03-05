'use strict';
module.exports = (sequelize, DataTypes) => {
  const ZipCode = sequelize.define('ZipCode', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    zip_code: {
      type: DataTypes.STRING(5),
      unique: true,
      allowNull: false,
    },
  }, {timestamps: false, tableName: 'zip_codes'});
  ZipCode.associate = function (models) {
    models.ZipCode.belongsToMany(
      models.GridSubregion,
      {
        through: 'zip_code_grid_subregions',
        foreignKey: 'zip_code_id',
        otherKey: 'grid_subregion_id',
        timestamps: false,
      }
    );
  };
  return ZipCode;
};
