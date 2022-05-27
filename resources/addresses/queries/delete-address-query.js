const Model = require("models");

module.exports = class DeleteAddressQuery {
  constructor(userId, addressId) {
    this.details = {
      userId,
      addressId,
    };
  }

  async get() {
    const user = await Model.User.findByPk(this.details.userId);
    const address = await Model.Address.findByPk(this.details.addressId);
    user.removeAddress(address);
    return address.destroy();
  }
};
