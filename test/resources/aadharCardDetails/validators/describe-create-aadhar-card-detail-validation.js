const chai = require("chai");
const expect = chai.expect;
const { verifyResultOk, verifyResultError } = require("helpers/verifiers");
const CreateAadharCardDetailValidator = require("resources/aadharCardDetails/validators/create-aadhar-card-details-validator.js");

describe("create aadhar card validation", () => {
  it("should mandate the aadhar name", async () => {
    const response = await CreateAadharCardDetailValidator.validate({
      name: null,
      aadharNumber: null,
    });
    verifyResultError((error) => {
      expect(error.errorMessage).to.include("Name can not be empty");
    })(response);
  });

  it("should mandate aadhar number", async () => {
    let response = await CreateAadharCardDetailValidator.validate({
      name: "suman's aadhar card",
    });
    verifyResultError((error) => {
      expect(error.errorMessage).to.include("Aadhar number can not be empty");
    })(response);
  });

  it("should have at least 7 characters in the aadhar number", async () => {
    let response = await CreateAadharCardDetailValidator.validate({
      name: "suman's aadhar card",
      aadharNumber: "222",
    });
    verifyResultError((error) => {
      expect(error.errorMessage).to.include(
        "Aadhar number should have at least 7 characters"
      );
    })(response);
  });

  it("should be valid if correct data is provided", async () => {
    let response = await CreateAadharCardDetailValidator.validate({
      name: "suman's aadhar card",
      aadharNumber: "222333434",
    });
    verifyResultOk(() => {})(response);
  });
});
