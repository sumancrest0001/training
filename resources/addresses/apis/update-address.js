const Route = require("route");
const db = require("db/repository");
const { respond, logInfo } = require("lib");
const UpdateAddressQuery = require("resources/addresses/queries/update-address-query");

const updateAddress = async (req, res) => {
  const data = {
    userId: req.params.userId,
    addressId: req.params.addressId,
    country: req.body.country,
    name: req.body.name,
    city: req.body.city,
    street: req.body.street,
  };
  const response = await db.execute(new UpdateAddressQuery(data));
  return respond(
    response,
    "successfully updated the address",
    "Failed to update the user address"
  );
};

Route.withOutSecurity()
  .noAuth()
  .put("/users/:userId/addresses/:addressId", updateAddress)
  .bind();
