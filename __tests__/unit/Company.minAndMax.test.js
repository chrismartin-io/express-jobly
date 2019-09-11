const Company = require('../../models/company');
const db = require("../../db");
process.env.NODE_ENV = 'test';


let c1;
let c2;

describe("Testing getting companies by min and max employees", function () {
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

  test("can we get a result from min and max values", async function () {
    const response = await Company.minAndMax(300, 6000);

    expect(response).toEqual([{
      handle: c1.handle,
      name: c1.name
    }])
  });

  test("can we get an empty value when min and max aren't matched", async function () {
    const response = await Company.minAndMax(300, 400);

    expect(response).toEqual([]);
  });
});


afterAll(async function () {
  await db.end();
});