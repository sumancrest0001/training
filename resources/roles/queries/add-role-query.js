const Model = require("models");

module.exports = class AddRolesQuery {
  constructor(data, userId) {
    this.details = {
      data,
      userId,
    };
  }

  async get() {
    const user = await Model.User.findByPk(this.details.userId);
    const createdRoles = await Model.Role.bulkCreate(this.details.data);
    return user.addRoles(createdRoles);
  }
};
