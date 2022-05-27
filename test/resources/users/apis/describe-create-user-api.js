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
  resolveValidationError,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateUserValidator = require("resources/users/validators/create-user-validator.js");
const CreateUserQuery = require("resources/users/queries/create-user-query.js");

describe("create a user api", () => {
  let sandbox = sinon.createSandbox();
  let req, res, userId;
  beforeEach(() => {
    sandbox.stub(uuid, "v4").returns("612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5");
    userId = uuid.v4();
    req = {
      body: {
        fullName: "user 3",
        country: "India",
        countryCode: "+91",
        email: "user3@gmail.com",
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

  it("should create a user when all the credentials are valid", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateUserQuery);
        })
      )
      .returns(
        resolveOk({
          id: userId,
          fullName: "user 3",
          country: "India",
          countryCode: "+91",
          email: "user3@gmail.com",
        })
      );
    const response = await TestRoutes.execute("/users", "Post", req, res);
    expect(response).to.eql({
      status: true,
      message: "Successfully created user",
      entity: {
        id: userId,
        fullName: "user 3",
        country: "India",
        countryCode: "+91",
        email: "user3@gmail.com",
      },
    });
  });

  it("should not create a user when validation fails", async () => {
    const dbExpectation = sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateUserQuery);
        })
      )
      .returns(
        resolveOk({
          fullName: "user 3",
          country: "India",
          countryCode: "+91",
          email: "user3@gmail.com",
        })
      );
    sandbox
      .mock(CreateUserValidator)
      .expects("validate")
      .returns(resolveValidationError(["Email can not be empty"]));
    const response = await TestRoutes.executeWithError(
      "/users",
      "Post",
      req,
      res
    );
    dbExpectation.never();
    expect(response).to.eql(new ValidationError(0, "Email can not be empty"));
  });

  it("should not create user when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users",
      "Post",
      req,
      res
    );

    expect(response).to.eql(
      new ApiError(
        0,
        "some random error happened",
        "Failed to create the user!"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
