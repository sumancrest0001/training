const chai = require('chai');
const expect = chai.expect;
const {verifyResultOk, verifyResultError} = require('helpers/verifiers');
const CreateRoleValidator = require('resources/roles/validators/create-role-validator.js');

describe('create role validation', () => {
    it('should mandate the role name', async () => {
       const response = await CreateRoleValidator.validate({});
       verifyResultError(
        (error) => {
            expect(error.errorMessage).to.include('Name can not be empty');
        }
    )(response);
    });

    it('should be valid if role name is provided', async () => {
        let response = await CreateRoleValidator.validate({name: 'Admin'});
        verifyResultOk(() => {})(response);
     });
});