const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond} = require('lib');
const db = require('db/repository');
const CreateRolesQuery = require('resources/roles/queries/create-bulk-roles-query.js');
const Result = require('folktale/result');

async function post(req) {
    const data = req.body.data;
    logInfo('Request to create multiple roles');
    const response = await db.execute(new CreateRolesQuery(data));
    return respond(Result.Ok(response), 'Successfully created multiple roles', 'Failed to created multiple roles!');
}

Route.withOutSecurity().noAuth().post('/roles', post).bind();

module.exports.post = post;