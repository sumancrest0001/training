const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond } = require("lib");
const db = require("db/repository");
const DeleteAddressQuery = require("resources/addresses/queries/delete-address-query.js");
const Result = require("folktale/result");

async function deleteAddress(req) {
  const { userId, addressId } = req.params;
  logInfo("Request to delete address");
  const response = await db.execute(new DeleteAddressQuery(userId, addressId));
  return respond(
    response,
    "Successfully deleted addresses",
    "Failed to delete addresses!"
  );
}

Route.withOutSecurity()
  .noAuth()
  .delete("/users/:userId/addresses/:addressId", deleteAddress)
  .bind();

module.exports.delete = deleteAddress;
