const model = require("models");

module.exports = class UpdateAddressQuery {
  constructor({ userId, addressId, name, street, city, country }) {
    this.userId = userId;
    this.addressId = addressId;
    this.name = name;
    this.street = street;
    this.country = country;
    this.city = city;
  }

  get() {}
};
