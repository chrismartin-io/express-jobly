const Company = require('../../models/company');
const db = require("../../db");
process.env.NODE_ENV = 'test';


let c1;
let c2;

describe("Testing the search function", function () {
  beforeEach(async function () {
    await db.query(`TRUNCATE companies`)
    c1 = {
        handle: "M32",
        name: "Mic3elSoft2",
        description: "Like MS paint for some reason.",
        logo_url: "http://wesoscary.org",
        num_employees: 5000
      }
    c1 = await Company.create(c1);

    c2 = {
        handle: "MLS",
        name: "MichellSoft",
        description: "The mean one",
        logo_url: "http://wesoscary.org",
        num_employees: 230
      }
    c2 = await Company.create(c2);

  });

  test("Can we get the correct company searching by handle", async function() {
    const response = await Company.search('MLS');

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }])
  });

  test("Can we get correct company searching by name", async function () {
    const response = await Company.search('Michell')

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }]);
  });

  test("Can we get an empy response", async function () {
    const response = await Company.search('llll');

    expect(response).toEqual([]);
  });
});


afterAll(async function () {
  await db.end();

});