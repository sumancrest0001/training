const Model = require('models');

module.exports = class CreateUserQuery {
    constructor(userId, fullName, country, countryCode, email, aadharId) {
        this.details = {
            userId,
            fullName,
            country,
            countryCode,
            email,
            aadharId
        };
    }

    get() {
        return Model.User.create({
            id: this.details.userId,
            fullName:this.details.fullName,
            country:this.details.country,
            countryCode:this.details.countryCode,
            email: this.details.email,
            aadharId:this.details.aadharId,
        });
    }
}