"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const userList = [
      {
        id: uuidv4(),
        full_name: "John",
        country: 'Nepal',
        country_code: "+977",
        email: "seed@seed.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: "John",
        country: 'India',
        country_code: "+977",
        email: "random@seed.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        full_name: "John",
        country: 'Nepal',
        country_code: "+977",
        email: "demo@seed.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    let users = await queryInterface.bulkInsert("users", userList, {
      returning: true,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};