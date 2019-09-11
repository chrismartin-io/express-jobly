const Company = require('../../models/company');
const db = require("../../db");
process.env.NODE_ENV = 'test';


let c1;
let c2;

describe("Testing by min OR max employees", function () {
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

  test("Can we find companies by min employees", async function() {
    const response = await Company.singleMinOrMax(300, '>=');

    expect(response).toEqual([{
      handle: c1.handle,
      name: c1.name
    }]);
  });

  test("Can we find companies by max employees", async function() {
    const response = await Company.singleMinOrMax(400, '<=');

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }]);
  });

  test("Can we get a proper empty response", async function() {
    const response = await Company.singleMinOrMax(7000, '>=');

    expect(response).toEqual([]);
  });
});

afterAll(async function () {
  await db.end();
});