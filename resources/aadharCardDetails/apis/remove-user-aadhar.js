const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond} = require('lib');
const db = require('db/repository');
const RemoveUserAadharQuery = require('resources/aadharCardDetails/queries/remove-aadhar-card-details-query.js');
const Result = require('folktale/result');

async function deleteUserAadhar(req) {
    const{ userId, aadharId}= req.params;
    logInfo('Request to delete aadhar card details', {
        userId, aadharId
    });
    const response = await db.execute(new RemoveUserAadharQuery(userId, aadharId));
    return respond(response, 'Successfully deleted aadhar card details', 'Failed to delete aadhar card details!');
}

Route.withOutSecurity().noAuth().delete('/users/:userId/aadhar/:aadharId', deleteUserAadhar).bind();

module.exports.delete = deleteUserAadhar;