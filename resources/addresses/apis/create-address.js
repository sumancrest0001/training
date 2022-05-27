const Route = require('route');
const {logInfo} = require('lib/functional/logger');
const {respond, whenResult, composeResult, withArgs} = require('lib');
const db = require('db/repository');
const { v4: uuidv4 } = require("uuid");
const CreateAddressQuery = require('resources/addresses/queries/create-address-query.js');
const CreateAddressValidator = require('resources/addresses/validators/create-address-validator.js');

async function post(req) {
  const {name, city, street, country} = req.body;
  const userId = req.params.userId;
  logInfo('Request to create address', {city, name, street, country});
  const addressId = uuidv4();
  const response = await composeResult(
      () => db.execute(new CreateAddressQuery(addressId, name, city, street, country, userId)),
      CreateAddressValidator.validate
    )({name, city, street, country});
  return respond(response, 'Successfully create address', 'Failed to create address!');
}

Route.withOutSecurity().noAuth().post('/users/:userId/addresses', post).bind();

module.exports.post = post;