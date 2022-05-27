const ApiError = require("lib/functional/api-error");
const ValidationError = require("lib/validation-error");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const uuid = require("uuid");
const db = require("db/repository");
const {
  resolveDbResult,
  resolveOk,
  resolveError,
  validationError,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateAadharValidator = require("resources/aadharCardDetails/validators/create-aadhar-card-details-validator.js");
const CreateAadharQuery = require("resources/aadharCardDetails/queries/create-aadhar-card-details-query.js");

describe("create aadhar api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "test's aadhar details",
        aadharNumber: "222ss33ss",
      },
      params: {
        userId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
      },
    };
    res = {
      setHeader: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy(() => {
        return res;
      }),
    };
  });

  it("should create an aadhar when all the credentials are valid", async () => {
    sandbox
      .mock(uuid)
      .expects("v4")
      .returns("612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5");
    const aadharId = uuid.v4();
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateAadharQuery);
        })
      )
      .returns(
        resolveOk({
          id: aadharId,
          userId: req.params.userId,
          name: req.body.name,
          aadharNumber: req.body.aadharNumber,
        })
      );
    const response = await TestRoutes.execute(
      "/users/:userId/aadhar",
      "Post",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully create aadhar card details",
      entity: {
        id: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
        userId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
        name: "test's aadhar details",
        aadharNumber: "222ss33ss",
      },
    });
  });

  it("should not create user when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/aadhar",
      "Post",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(
        0,
        "some random error happened",
        "Failed to create aadhar card details!"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
