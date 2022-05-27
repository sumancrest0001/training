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
const AddRolesQuery = require("resources/roles/queries/add-role-query.js");

describe("add user roles api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        data: [
          {
            name: "Manager",
          },
          {
            name: "Admin",
          },
        ],
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

  it("should add user roles when valid data is sent", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(AddRolesQuery);
        })
      )
      .returns(
        resolveOk([
          {
            userId: req.params.userId,
            roleId: "612b1a2d-1111-4ef1-bd8b-b3d726883fc5",
          },
          {
            userId: req.params.userId,
            roleId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
          },
        ])
      );
    const response = await TestRoutes.execute(
      "/users/:userId/roles",
      "Post",
      req,
      res
    );
    expect(response).to.eql({
      status: true,
      message: "Successfully added multiple roles",
      entity: [
        {
          userId: "612b1a2d-2225-4ef1-bd8b-b3d726883fc5",
          roleId: "612b1a2d-1111-4ef1-bd8b-b3d726883fc5",
        },
        {
          userId: "612b1a2d-2225-4ef1-bd8b-b3d726883fc5",
          roleId: "612b1a2d-2222-4ef1-bd8b-b3d726883fc5",
        },
      ],
    });
  });

  it("should not create address when random error happens", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .returns(resolveError("some random error happened"));
    const response = await TestRoutes.executeWithError(
      "/users/:userId/roles",
      "Post",
      req,
      res
    );
    expect(response).to.eql(
      new ApiError(
        0,
        "some random error happened",
        "Failed to added multiple roles!"
      )
    );
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
