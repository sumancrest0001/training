const chai = require("chai");
const sinonChai = require("sinon-chai");
const { expect } = chai;
chai.use(sinonChai);
const db = require("db/repository");
const ds = require("helpers/dataSetup");
const { verifyArgs, verifyResultOk } = require("helpers/verifiers");
const RunQuery = require("data/run-query");
const AddRolesQuery = require("resources/roles/queries/add-role-query");

describe("add bulk roles query", () => {
  let user, role1, role2;

  beforeEach(async () => {
    user = await ds.createSingle(ds.user);
    role1 = await ds.buildSingle(ds.role);
    role2 = await ds.buildSingle(ds.role);
  });

  it("should add multiple roles at once to a user", async () => {
    const addedRolesResponse = await db.execute(
      new AddRolesQuery([role1, role2], user.id)
    );
    verifyResultOk((addedResponse) => {
      expect(addedResponse.length).to.be.eql(2);
      const firstRole = addedResponse.find((role) => role.roleId == role1.id);
      expect(firstRole.userId).to.be.eql(user.id);
    })(addedRolesResponse);

    const fetchedUserRolesResponse = await db.execute(
      new RunQuery('select * from "userRoles" where user_id=:id', {
        id: user.id,
      })
    );
    verifyResultOk((fetchedUserRoles) => {
      console.log(fetchedUserRoles);
      expect(fetchedUserRoles.length).to.be.eql(2);
    })(fetchedUserRolesResponse);
  });

  afterEach(async () => {
    await ds.deleteAll();
  });
});
