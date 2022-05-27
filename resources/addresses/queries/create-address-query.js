const Model = require('models');

module.exports = class CreateAddressQuery {
    constructor(addressId, name, city, street, country, userId) {
        this.details = {
            addressId,
            name,
            city,
            street,
            country,
            userId
        };
    }

    async get() {
        const user = await Model.User.findOne({where: {id: this.details.userId}});
        return user.createAddress({
            id: this.details.addressId,
            name: this.details.name,
            city: this.details.city,
            street: this.details.street,
            country: this.details.country
        });
    }
}