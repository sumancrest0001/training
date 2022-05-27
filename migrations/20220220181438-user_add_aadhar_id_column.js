"use strict";

module.exports = {
  async up(queryInterface, DataTypes) {
    return Promise.all([
      queryInterface.addColumn("users", "aadhar_id", {
        type: DataTypes.UUID,
        references: {
          model: "aadharCardDetails",
          key: "id",
        },
      }),
    ]);
  },

  async down(queryInterface, DataTypes) {
    return Promise.all([queryInterface.removeColumn("users", "aadhar_id")]);
  },
};
