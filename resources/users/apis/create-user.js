const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond, whenResult, composeResult, withArgs } = require("lib");
const db = require("db/repository");
const { v4: uuidv4 } = require("uuid");
const CreateUserQuery = require("resources/users/queries/create-user-query.js");
const CreateUserValidator = require("resources/users/validators/create-user-validator.js");

async function post(req) {
  const { fullName, country, countryCode, email, aadharId } = req.body;
  logInfo("Request to create user", { fullName, country, countryCode, email });
  const userId = uuidv4();
  const response = await composeResult(
    withArgs(
      db.execute,
      new CreateUserQuery(
        userId,
        fullName,
        country,
        countryCode,
        email,
        aadharId
      )
    ),
    CreateUserValidator.validate
  )({ fullName, country, countryCode, email });

  return respond(
    response,
    "Successfully created user",
    "Failed to create the user!"
  );
}

Route.withOutSecurity().noAuth().post("/users", post).bind();

module.exports.post = post;
