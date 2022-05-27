"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Address, AadharCardDetail, Role }) {
      this.hasMany(Address, { foreignKey: "userId" });
      this.belongsTo(AadharCardDetail, {
        foreignKey: "aadharId",
      });
      this.belongsToMany(Role, {
        through: "UserRole",
        foreignKey: "userId",
        otherKey: "roleId",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "full_name",
      },
      aadharId: {
        type: DataTypes.UUID,
        field: "aadhar_id",
        references: {
          model: "aadharCardDetails",
          key: "id",
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.STRING,
        field: "country_code",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
