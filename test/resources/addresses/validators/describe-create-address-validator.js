const chai = require('chai');
const expect = chai.expect;
const {verifyResultOk, verifyResultError} = require('helpers/verifiers');
const CreateAddressValidator = require('resources/addresses/validators/create-address-validator.js');

describe('create address validation', () => {
    it('should mandate address name', async () => {
       const response = await CreateAddressValidator.validate({street: "random", city: "kathmandu", country: "Nepal"});
       verifyResultError(
        (error) => {
            expect(error.errorMessage).to.include('Name can not be empty');
        }
    )(response);
    });

    it('should mandate a street in an address', async () => {
        const response = await CreateAddressValidator.validate({name: 'user\'s address', city: "kathmandu", country: "Nepal"});
        verifyResultError(
         (error) => {
             expect(error.errorMessage).to.include('Street can not be empty');
         }
     )(response);
     });

     it('should mandate a city in address', async () => {
        const response = await CreateAddressValidator.validate({name: 'user\'s address', street: "random", country: "Nepal"});
        verifyResultError(
         (error) => {
             expect(error.errorMessage).to.include('City can not be empty');
         }
     )(response);
     });

     it('should mandate a country in address', async () => {
        const response = await CreateAddressValidator.validate({name: 'user\'s address', street: "random", city: "Kathmandu"});
        verifyResultError(
         (error) => {
             expect(error.errorMessage).to.include('Country can not be empty');
         }
     )(response);
     });

    it('should be valid if all data provided are correct', async () => {
        let response = await CreateAddressValidator.validate({name: 'user\'s address', street: "random", city: "kathmandu", country: "Nepal"});
        verifyResultOk(() => {})(response);
     });
});