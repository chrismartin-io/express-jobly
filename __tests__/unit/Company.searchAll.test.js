const Company = require('../../models/company');
const db = require("../../db");
process.env.NODE_ENV = 'test';


let c1;
let c2;

describe("Testing the search all function", function () {
  beforeEach(async function () {
    await db.query(`DELETE FROM companies`)
    c1 = {
      body: {
        handle: "M32",
        name: "Mic3elSoft2",
        description: "Like MS paint for some reason.",
        logo_url: "http://wesoscary.org",
        num_employees: 5000
      }
    };
    c1 = await Company.create(c1);

    c2 = {
      body: {
        handle: "MLS",
        name: "MichellSoft",
        description: "The mean one",
        logo_url: "http://wesoscary.org",
        num_employees: 230
      }
    };
    c2 = await Company.create(c2);

  });

  test("Can we get company by name", async function () {
    const response = await Company.searchAll('MichellSoft', 200, 300);

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }]);
  });

  test("Can we get company by partial name", async function () {
    const response = await Company.searchAll('Mic', 0, 6000);

    expect(response).toEqual([{
      handle: c1.handle,
      name: c1.name
    }, {
      handle: c2.handle,
      name: c2.name
    }])
    expect(response.length).toEqual(2);
  });

  test("Can get company by handle", async function () {
    const response = await Company.searchAll('MLS', 200, 300);

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }]);
    expect(response.length).toEqual(1);
  });

  test("Can we search by min_employees and max_employees", async function () {
    const response = await Company.searchAll('Mic', 300, 6000);
    const noresponse = await Company.searchAll('Mic', 300, 1000);

    expect(response).toEqual([{
      handle: c1.handle,
      name: c1.name
    }]);
    expect(response.length).toEqual(1);

    expect(noresponse).toEqual([]);
    expect(noresponse.length).toEqual(0);

  });

});

afterAll(async function () {
  await db.end();
});