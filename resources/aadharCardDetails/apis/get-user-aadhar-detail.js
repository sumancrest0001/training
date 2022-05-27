const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond, whenResult, composeResult, withArgs} = require('lib');
const db = require('db/repository');
const GetUserAadharQuery = require('resources/aadharCardDetails/queries/get-aadhar-card-details-query.js');
const Result = require('folktale/result');

async function get(req) {
    const userId = req.params.userId;
    logInfo('Request to get aadhar card details', {
        userId
    });
    const response = await db.execute(new GetUserAadharQuery(userId));
    return respond(response, 'Successfully retrieve aadhar card details', 'Failed to get aadhar card details!');
}

Route.withOutSecurity().noAuth().get('/users/:userId/aadhar', get).bind();

module.exports.get = get;