const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const CreateAddressQuery = require("resources/addresses/queries/create-address-query");

describe("create address query", () => {
  let user, address;

  beforeEach(async () => {
    user = await ds.createSingle(ds.user);
    address = await ds.buildSingle(ds.address, { user });
  });

  it("should create an address for a user", async () => {
    const createdAddressResponse = await db.execute(
      new CreateAddressQuery(
        address.id,
        address.name,
        address.city,
        address.street,
        address.country,
        user.id
      )
    );
    verifyResultOk((createdAddress) => {
      expect(createdAddress.dataValues.id).to.be.eql(address.id);
      expect(createdAddress.dataValues.name).to.be.eql(address.name);
      expect(createdAddress.dataValues.city).to.be.eql(address.city);
      expect(createdAddress.dataValues.street).to.be.eql(address.street);
      expect(createdAddress.dataValues.country).to.be.eql(address.country);
      expect(createdAddress.dataValues.userId).to.be.eql(user.id);
    })(createdAddressResponse);

    const fetchAddressResponse = await db.findOne(
      new RunQuery('select * from "addresses" where id=:id', {
        id: address.id,
      })
    );
    verifyResultOk((fetchedAddress) => {
      expect(fetchedAddress.id).to.be.eql(address.id);
      expect(fetchedAddress.name).to.be.eql(address.name);
      expect(fetchedAddress.city).to.be.eql(address.city);
      expect(fetchedAddress.street).to.be.eql(address.street);
      expect(fetchedAddress.country).to.be.eql(address.country);
      expect(fetchedAddress.user_id).to.be.eql(user.id);
    })(fetchAddressResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
