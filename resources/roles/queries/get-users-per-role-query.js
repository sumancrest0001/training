const Model = require('models');

module.exports = class GetusersPerRoleQuery {
    constructor(roleId) {
        this.details = {
            roleId
        };
    }

    async get() {
        return Model.User.findAndCountAll({
            include: [
               { model: Model.Role, where: {id: this.details.roleId}}
            ],
            limit: 3
          });
    }
}