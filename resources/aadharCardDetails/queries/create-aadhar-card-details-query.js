const Model = require('models');

module.exports = class CreateAadharQuery {
    constructor(aadharId, name, aadharNumber, userId) {
        this.details = {
            userId,
            name,
            aadharNumber,
            aadharId
        };
    }

    async get() {
        const user = await Model.User.findOne({where: {id: this.details.userId}});
        return user.createAadharCardDetail({id: this.details.aadharId, name: this.details.name, aadharNumber: this.details.aadharNumber});
    }
}