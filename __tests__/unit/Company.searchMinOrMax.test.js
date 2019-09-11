const Company = require('../../models/company');
const db = require("../../db");
process.env.NODE_ENV = 'test';


let c1;
let c2;

describe("Testing searching with search str and min or max", function () {
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

  test('Can we search by min', async function () {
    const response = await Company.searchMinOrMax('M', 300, '>=');

    expect(response).toEqual([{
      handle: c1.handle,
      name: c1.name
    }])
  });

  test('Can we search by max', async function () {
    const response = await Company.searchMinOrMax('M', 300, '<=');

    expect(response).toEqual([{
      handle: c2.handle,
      name: c2.name
    }])
  })

  test('Can we get an empty return when nothing matches', async function () {
    const noresponse1 = await Company.searchMinOrMax('kk', 300, '<=');
    const noresponse2 = await Company.searchMinOrMax('M', 6000, '>=');

    expect(noresponse1).toEqual([])
    expect(noresponse2).toEqual([])
  });
});


afterAll(async function () {
  await db.end();
});