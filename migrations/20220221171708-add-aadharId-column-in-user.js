'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {
    return Promise.all([
      queryInterface.addColumn('users', 'aadhar_id', {
        type: DataTypes.UUID,
      })
    ]);
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  }
};
