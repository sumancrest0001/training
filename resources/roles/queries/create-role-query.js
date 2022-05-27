const Model = require("models");

module.exports = class CreateRolesQuery {
  constructor(data) {
    this.data = data;
  }

  async get() {
    return Model.Role.create(this.data);
  }
};
