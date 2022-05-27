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
const GetUsersQuery = require("resources/users/queries/get-users-query.js");

describe("get users api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  const mockedUsers = [
    {
      id: "612b1a2d-c4c5-4ef1-bd8b-b3d726883fc5",
      fullName: "user1",
      email: "user1@gmail.com",
      country: "India",
      countryCode: "+91",
    },
  ];
  beforeEach(() => {
    req = {};
    res = {
      setHeader: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy(() => {
        return res;
      }),
    };
  });

  it("should get all the users", async () => {
    sandbox
      .mock(db)
      .expects("find")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(GetUsersQuery);
        })
      )
      .returns(resolveOk(mockedUsers));
    const response = await TestRoutes.execute("/users", "Get", req, res);
    expect(response).to.eql({
      status: true,
      message: "Successfully get all users",
      entity: mockedUsers,
    });
  });

  it("should get empty when there is no user", async () => {
    sandbox
      .mock(db)
      .expects("find")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(GetUsersQuery);
        })
      )
      .returns(resolveOk([]));
    const response = await TestRoutes.execute("/users", "Get", req, res);
    expect(response).to.eql({
      status: true,
      message: "Successfully get all users",
      entity: [],
    });
  });

  it("should not return users if random error happens", async () => {
    sandbox
      .mock(db)
      .expects("find")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users",
      "Get",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(0, "some random error happened", "Failed to get all users!")
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
