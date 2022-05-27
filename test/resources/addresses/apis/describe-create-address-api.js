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
const CreateAddressQuery = require("resources/addresses/queries/create-address-query.js");
const CreateAddressValidiator = require("resources/addresses/validators/create-address-validator.js");

describe("create a address api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "test user's address",
        country: "India",
        city: "city",
        street: "street-1",
      },
      params: {
        userId: "612b1a2d-2225-4ef1-bd8b-b3d726883fc5",
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

  it("should create an address for user when all the credentials are valid", async () => {
    sandbox.stub(uuid, "v4").returns("612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5");
    const addressId = uuid.v4();
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateAddressQuery);
        })
      )
      .returns(
        resolveOk({
          id: addressId,
          userId: req.params.userId,
          name: req.body.name,
          country: req.body.country,
          city: req.body.city,
          street: req.body.street,
        })
      );
    const response = await TestRoutes.execute(
      "/users/:userId/addresses",
      "Post",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully create address",
      entity: {
        id: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
        userId: "612b1a2d-2225-4ef1-bd8b-b3d726883fc5",
        name: "test user's address",
        country: "India",
        city: "city",
        street: "street-1",
      },
    });
  });

  it("should not create address when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/addresses",
      "Post",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(0, "some random error happened", "Failed to create address!")
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
