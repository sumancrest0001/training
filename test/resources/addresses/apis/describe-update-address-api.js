const ApiError = require("lib/functional/api-error");
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
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const UpdateAddressQuery = require("resources/addresses/queries/update-address-query");

describe.only("update address api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        city: "kathmandu",
        country: "nepal",
      },
      params: {
        userId: "123",
        addressId: "234",
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
  it("should update the address if valid data are passed", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(UpdateAddressQuery);
        })
      )
      .returns(
        resolveOk({
          id: req.params.addressId,
          city: req.body.city,
          country: req.body.country,
          street: "street1",
          name: "test's address",
        })
      );
    const response = await TestRoutes.execute(
      "/users/:userId/addresses/:addressId",
      "Put",
      req,
      res
    );
    expect(response).to.be.eql({
      status: true,
      message: "successfully updated the address",
      entity: {
        id: req.params.addressId,
        city: "kathmandu",
        country: "nepal",
        street: "street1",
        name: "test's address",
      },
    });
  });

  it("respond failure when some error occurs", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error occured"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/addresses/:addressId",
      "Put",
      req,
      res
    );

    expect(response).to.be.eql(
      new ApiError(
        0,
        "some random error occured",
        "Failed to update the user address"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
