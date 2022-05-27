const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond, whenResult, composeResult, withArgs} = require('lib');
const db = require('db/repository');
const { v4: uuidv4 } = require("uuid");
const CreateAadharQuery = require('resources/aadharCardDetails/queries/create-aadhar-card-details-query.js');
const CreateAadharValidation = require('../validators/create-aadhar-card-details-validator');

const Result = require('folktale/result');

async function post(req) {
    const {name, aadharNumber} = req.body;
    const userId = req.params.userId;
    logInfo('Request to create aadhar card details', {
        name, aadharNumber
    });
    const aadharId = uuidv4();
    const response = await composeResult(
      () => db.execute(new CreateAadharQuery(aadharId, name, aadharNumber, userId)),
      CreateAadharValidation.validate
    )({name, aadharNumber});
    return respond(response, 'Successfully create aadhar card details', 'Failed to create aadhar card details!');
}

Route.withOutSecurity().noAuth().post('/users/:userId/aadhar', post).bind();

module.exports.post = post;