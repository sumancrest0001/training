const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const UpdateUserQuery = require("resources/users/queries/update-user-query");

describe("update user query", () => {
  let user;

  beforeEach(async () => {
    user = await ds.createSingle(ds.user);
  });

  it("should update a user", async () => {
    await db.execute(
      new UpdateUserQuery(
        user.id,
        user.full_name,
        user.country,
        user.country_code,
        user.email
      )
    );
    const fetchUserResponse = await db.findOne(
      new RunQuery('select * from "users" where id=:id', { id: user.id })
    );
    verifyResultOk((updatedUser) => {
      console.log(updatedUser);
      expect(user.full_name).to.eq(updatedUser.full_name);
      expect(user.id).to.eq(updatedUser.id);
      expect(user.country).to.eq(updatedUser.country);
      expect(user.country_code.toString()).to.eq(updatedUser.country_code);
      expect(user.email).to.eq(updatedUser.email);
    })(fetchUserResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
