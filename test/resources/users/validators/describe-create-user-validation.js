const chai = require('chai');
const expect = chai.expect;
const {verifyResultOk, verifyResultError} = require('helpers/verifiers');
const CreateUserValidator = require('resources/users/validators/create-user-validator.js');

describe('create user validation', () => {
    it('should mandate the name', async () => {
       let response = await CreateUserValidator.validate({country: "Nepal", countryCode: "+977", email: "suman.shrestha@napses.com"});
       verifyResultError(
           (error) => {
               expect(error.errorMessage).to.include('fullName can not be empty');
           }
       )(response);
    });

    it('should mandate the email address', async () => {
        let response = await CreateUserValidator.validate({fullName: "Suman Shrestha", country: "Nepal", countryCode: "+977"});
        verifyResultError(
            (error) => {
                expect(error.errorMessage).to.include('Email can not be empty');
            }
        )(response);
     });

     it('Email should be a valid email', async () => {
        let response = await CreateUserValidator.validate({fullName: "Suman Shrestha", country: "Nepal", countryCode: "+977", email: "napses.com"});
        verifyResultError(
            (error) => {
                expect(error.errorMessage).to.include("Email should be valid");
            }
        )(response);
     });

     it('should mandate the country', async () => {
        let response = await CreateUserValidator.validate({fullName: "Suman Shrestha", countryCode: "+977", email: "suman.shrestha@napses.com"});
        verifyResultError(
            (error) => {
                expect(error.errorMessage).to.include('Country can not be empty');
            }
        )(response);
     });

     it('should be valid if all the data provided are correct', async () => {
        let response = await CreateUserValidator.validate({fullName: "Suman Shrestha", country: "Nepal", countryCode: "+977", email: "suman.shrestha@napses.com"});
        verifyResultOk(() => {})(response);
     });
})