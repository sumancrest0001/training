const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond} = require('lib');
const db = require('db/repository');
const GetUsersPerRoleQuery = require('resources/roles/queries/get-users-per-role-query.js');
const Result = require('folktale/result');

async function get(req) {
    const {roleId} = req.params;
    logInfo('Request to get users per role');
    const response = await db.execute(new GetUsersPerRoleQuery(roleId));
    return respond(Result.Ok(response), 'Successfully got users per role', 'Failed to get users per role!');
}

Route.withOutSecurity().noAuth().get('/roles/:roleId/users', get).bind();

module.exports.get = get;