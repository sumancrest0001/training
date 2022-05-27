const Model = require('models');

module.exports = class RemoveUserAadharQuery {
    constructor(userId, aadharId) {
        this.details = {
            userId,
            aadharId
        };
    }

    async get() {
        Model.AadharCardDetail.destroy({where: {id: this.details.aadharId}});
        return Model.User.update({aadharId: null}, {where: {id: this.details.userId}});
    }
}