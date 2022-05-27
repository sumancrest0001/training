const Route = require("route");
const { logInfo } = require("lib/functional/logger");
const { respond } = require("lib");
const db = require("db/repository");
const AddRolesQuery = require("resources/roles/queries/add-role-query");
const CreateRoleValidator = require("resources/roles/validators/create-role-validator");
const Result = require("folktale/result");
const { v4: uuidv4 } = require("uuid");

async function post(req) {
  let data = req.body.data;
  const { userId } = req.params;
  logInfo("Request to add multiple roles", { data });
  data = data.map((item) => ({ ...item, id: uuidv4() }));
  const response = await db.execute(new AddRolesQuery(data, userId));
  return respond(
    response,
    "Successfully added multiple roles",
    "Failed to added multiple roles!"
  );
}

Route.withOutSecurity().noAuth().post("/users/:userId/roles", post).bind();

module.exports.post = post;
