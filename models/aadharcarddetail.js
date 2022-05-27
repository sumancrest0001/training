'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AadharCardDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.hasOne(User, { foreignKey: "aadharId" });
    }
  }
  AadharCardDetail.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: DataTypes.STRING,
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'aadhar_number'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName:"aadharCardDetails",
    modelName: 'AadharCardDetail',
  });
  return AadharCardDetail;
};