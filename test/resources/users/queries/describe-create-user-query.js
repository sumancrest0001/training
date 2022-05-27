const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const CreateUserQuery = require("resources/users/queries/create-user-query");

describe("create user query", () => {
  let user;

  beforeEach(async () => {
    user = await ds.buildSingle(ds.user);
  });

  it("should create a user", async () => {
    const createdUserResponse = await db.execute(
      new CreateUserQuery(
        user.id,
        user.full_name,
        user.country,
        user.country_code,
        user.email
      )
    );
    verifyResultOk((createdUser) => {
      expect(user.fullName).to.eq(createdUser.full_name);
      expect(user.id).to.eq(createdUser.id);
      expect(user.country).to.eq(createdUser.country);
      expect(user.countryCode).to.eq(createdUser.country_code);
      expect(user.email).to.eq(createdUser.email);
    })(createdUserResponse);

    const fetchUserResponse = await db.findOne(
      new RunQuery('select * from "users" where id=:id', { id: user.id })
    );
    verifyResultOk((createdUser) => {
      expect(user.full_name).to.eq(createdUser.full_name);
      expect(user.id).to.eq(createdUser.id);
      expect(user.country).to.eq(createdUser.country);
      expect(user.country_code.toString()).to.eq(createdUser.country_code);
      expect(user.email).to.eq(createdUser.email);
    })(fetchUserResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
