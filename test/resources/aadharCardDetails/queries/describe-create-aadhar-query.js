const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const CreateAadharQuery = require("resources/aadharCardDetails/queries/create-aadhar-card-details-query");

describe("create aadhar query", () => {
  let user, aadhar;

  beforeEach(async () => {
    user = await ds.createSingle(ds.user);
    aadhar = await ds.buildSingle(ds.aadhar, { user });
  });

  it("should create an aadhar for a user", async () => {
    const createdUserResponse = await db.execute(
      new CreateAadharQuery(
        aadhar.id,
        aadhar.name,
        aadhar.aadhar_number,
        user.id
      )
    );
    verifyResultOk((createdAaadhar) => {
      expect(createdAaadhar.dataValues.id).to.be.eql(aadhar.id);
      expect(createdAaadhar.dataValues.name).to.be.eql(aadhar.name);
      expect(createdAaadhar.dataValues.aadharNumber).to.be.eql(
        aadhar.aadhar_number.toString()
      );
    })(createdUserResponse);

    const fetchAadharResponse = await db.findOne(
      new RunQuery('select * from "aadharCardDetails" where id=:id', {
        id: aadhar.id,
      })
    );
    verifyResultOk((fetchedAadhar) => {
      expect(aadhar.name).to.eq(fetchedAadhar.name);
      expect(aadhar.id).to.eq(fetchedAadhar.id);
      expect(aadhar.aadhar_number.toString()).to.eq(
        fetchedAadhar.aadhar_number
      );
    })(fetchAadharResponse);

    const fetchUserResponse = await db.findOne(
      new RunQuery('select * from "users" where id=:id', {
        id: user.id,
      })
    );
    verifyResultOk((fetchedUser) => {
      expect(aadhar.id).to.eq(fetchedUser.aadhar_id);
    })(fetchUserResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
