const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond } = require("lib");
const db = require("db/repository");
const GetAddressesQuery = require("resources/addresses/queries/get-addresses-query.js");
const Result = require("folktale/result");

async function get(req) {
  const userId = req.params.userId;
  logInfo("Request to get address");
  const response = await db.execute(new GetAddressesQuery(userId));
  return respond(
    response,
    "Successfully get addresses",
    "Failed to get addresses!"
  );
}

Route.withOutSecurity().noAuth().get("/users/:userId/addresses", get).bind();

module.exports.get = get;
