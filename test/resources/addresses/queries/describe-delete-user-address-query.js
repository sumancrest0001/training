const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const DeleteAddressesQuery = require("resources/addresses/queries/delete-address-query");

describe("delete an user address query", () => {
  let address;

  beforeEach(async () => {
    address = await ds.createSingle(ds.address);
  });

  it("should delete the particular address for a user", async () => {
    const deleteAddressResponse = await db.execute(
      new DeleteAddressesQuery(address.user.id, address.id)
    );
    verifyResultOk((deleteResponse) => {
      expect(deleteResponse).to.have.lengthOf(0);
    })(deleteAddressResponse);

    const fetchAddressResponse = await db.findOne(
      new RunQuery('select * from "addresses" where id=:id', {
        id: address.id,
      })
    );
    verifyResultOk((fetchedAddress) => {
      expect(fetchedAddress).to.be.null;
    })(fetchAddressResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
