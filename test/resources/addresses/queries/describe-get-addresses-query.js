const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const GetAddressesQuery = require("resources/addresses/queries/get-addresses-query");
const CreateAddressQuery = require("resources/addresses/queries/create-address-query");

describe("get addresses query", () => {
  let address1;
  let address2;
  let user;

  beforeEach(async () => {
    address1 = await ds.createSingle(ds.address);
    /*  address1 = await ds.buildSingle(ds.address);
    address2 = await ds.buildSingle(ds.address);
    await db.execute(
      new CreateAddressQuery(
        address1.id,
        address1.name,
        address1.city,
        address1.street,
        address1.country,
        user.id
      )
    );
    await db.execute(
      new CreateAddressQuery(
        address2.id,
        address2.name,
        address2.city,
        address2.street,
        address2.country,
        user.id
      )
    ); */
  });

  it("should retrieve all the addresses for a user", async () => {
    const fetchAddressesResponse = await db.execute(
      new GetAddressesQuery(address1.user.id)
    );
    verifyResultOk((retrievedAddresses) => {
      console.log(retrievedAddresses);
      const selectedAddress = retrievedAddresses.find(
        (retrievedAddress) => retrievedAddress.id === address1.id
      );
      expect(selectedAddress.userId).to.be.eql(address1.user.id);
      expect(selectedAddress.name).to.be.eql(address1.name);
      expect(selectedAddress.id).to.be.eql(address1.id);
      expect(selectedAddress.street).to.be.eql(address1.street);
      expect(selectedAddress.city).to.be.eql(address1.city);
      expect(selectedAddress.country).to.be.eql(address1.country);
    })(fetchAddressesResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
