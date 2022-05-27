const ApiError = require("lib/functional/api-error");
const ValidationError = require("lib/validation-error");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const db = require("db/repository");
const {
  resolveDbResult,
  resolveOk,
  resolveError,
  validationError,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const GetAddressesQuery = require("resources/addresses/queries/get-addresses-query.js");

describe("get addresses api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  const mockedAddresses = [
    {
      id: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
      userId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
      name: "test user's address",
      country: "India",
      city: "city",
      street: "street-1",
    },
  ];
  beforeEach(() => {
    req = {
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

  it("should get all the addresses", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(GetAddressesQuery);
        })
      )
      .returns(resolveOk(mockedAddresses));
    const response = await TestRoutes.execute(
      "/users/:userId/addresses",
      "Get",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully get addresses",
      entity: mockedAddresses,
    });
  });

  it("should get empty when there is no user", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(GetAddressesQuery);
        })
      )
      .returns(resolveOk([]));
    const response = await TestRoutes.execute(
      "/users/:userId/addresses",
      "Get",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully get addresses",
      entity: [],
    });
  });

  it("should not return addresses if random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/addresses",
      "Get",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(0, "some random error happened", "Failed to get addresses!")
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
