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
const CreateUserValidator = require("resources/users/validators/create-user-validator.js");
const UpdateUserQuery = require("resources/users/queries/update-user-query.js");

describe("update a user api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        fullName: "user 3 updated",
        country: "Nepal",
        countryCode: "+91",
      },
      params: {
        userId: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
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

  it("should update a user when all the passed values are correct", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(UpdateUserQuery);
        })
      )
      .returns(
        resolveOk({
          id: req.params.userId,
          fullName: "user 3 updated",
          country: "Nepal",
          countryCode: "+91",
          email: "user3@gmail.com",
        })
      );
    const response = await TestRoutes.execute(
      "/users/:userId",
      "Put",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully updated the user",
      entity: {
        id: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
        fullName: "user 3 updated",
        country: "Nepal",
        countryCode: "+91",
        email: "user3@gmail.com",
      },
    });
  });

  it("should not update user when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId",
      "Put",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(
        0,
        "some random error happened",
        "Failed to update the user!"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
