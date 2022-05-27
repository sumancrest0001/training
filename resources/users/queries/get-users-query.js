const Model = require("models");

module.exports = class GetUsersQuery {
  get() {
    return Model.User.findAll();
  }
};
