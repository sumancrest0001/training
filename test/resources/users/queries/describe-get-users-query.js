const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const GetUsersQuery = require("resources/users/queries/get-users-query");

describe("get users query", () => {
  let user;
  let user2;

  beforeEach(async () => {
    user = await ds.createSingle(ds.user);
    user2 = await ds.createSingle(ds.user);
  });

  it("should retrieve all the users", async () => {
    const fetchUserResponse = await db.execute(new GetUsersQuery());
    verifyResultOk((retrievedUsers) => {
      const selectedUser = retrievedUsers.find(
        (retrievedUser) => retrievedUser.id === user.id
      );
      expect(retrievedUsers.length).to.be.eql(2);
      expect(selectedUser.fullName).to.eql(user.full_name);
    })(fetchUserResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
