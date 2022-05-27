const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond } = require("lib");
const db = require("db/repository");
const Result = require("folktale/result");
const GetUsersQuery = require("resources/users/queries/get-users-query.js");

async function get(req) {
  logInfo("Request to get all users");
  const response = await db.find(new GetUsersQuery());
  return respond(
    response,
    "Successfully get all users",
    "Failed to get all users!"
  );
}

Route.withOutSecurity().noAuth().get("/users", get).bind();

module.exports.get = get;
