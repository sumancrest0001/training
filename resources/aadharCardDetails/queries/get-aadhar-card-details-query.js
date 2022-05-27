const Model = require('models');

module.exports = class GetUserAadharQuery {
    constructor(userId) {
        this.details = {
            userId
        };
    }

    async get() {
        const user = await Model.User.findOne({where: {id: this.details.userId}});
        return user.getAadharCardDetail();
    }
}