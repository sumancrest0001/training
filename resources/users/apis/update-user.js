const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond } = require("lib");
const db = require("db/repository");
const UpdateUserQuery = require("resources/users/queries/update-user-query.js");
const Result = require("folktale/result");

async function put(req) {
  const { fullName, country, countryCode, email, aadharId } = req.body;
  const userId = req.params.userId;

  logInfo("Request to update user");
  const response = await db.execute(
    new UpdateUserQuery(userId, fullName, country, countryCode, email, aadharId)
  );
  return respond(
    response,
    "Successfully updated the user",
    "Failed to update the user!"
  );
}

Route.withOutSecurity().noAuth().put("/users/:userId", put).bind();

module.exports.put = put;
