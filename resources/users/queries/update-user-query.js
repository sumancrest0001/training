const Model = require("models");

module.exports = class UpdateUserQuery {
  constructor(userId, fullName, country, countryCode, email, aadharId) {
    this.details = {
      userId,
      fullName,
      country,
      countryCode,
      email,
      aadharId,
    };
  }

  get() {
    return Model.User.update(
      {
        id: this.details.userId,
        fullName: this.details.fullName,
        country: this.details.country,
        countryCode: this.details.countryCode,
        email: this.details.email,
        aadharId: this.details.aadharId,
      },
      { return: true, where: { id: this.details.userId } }
    );
  }
};
