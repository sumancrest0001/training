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
const DeleteAddressQuery = require("resources/addresses/queries/delete-address-query.js");

describe("delete an address api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        userId: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
        addressId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
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

  it("should delete address for the user", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(DeleteAddressQuery);
        })
      )
      .returns(resolveOk([]));
    const response = await TestRoutes.execute(
      "/users/:userId/addresses/:addressId",
      "Delete",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully deleted addresses",
      entity: [],
    });
  });

  it("should not update user when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/addresses/:addressId",
      "Delete",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(
        0,
        "some random error happened",
        "Failed to delete addresses!"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
