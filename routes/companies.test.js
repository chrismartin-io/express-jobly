const Company = require('../models/company');
const db = require("../db");
const request = require("supertest")
process.env.NODE_ENV = 'test';
const app = require('../app');

let c1;
let c2;


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
  }

  c1 = await Company.create(c1);

  c2 = {
    handle: "MLS",
    name: "MichellSoft",
    description: "The mean one",
    logo_url: "http://wesoscary.org",
    num_employees: 230
  }
});


describe('get /companies route', function () {
  test("Can we get all the companies", async function () {
    const response = await request(app).get('/companies');

    expect(response.body).toEqual({
      companies: [{
        handle: c1.handle,
        name: c1.name
      }]
    });
  });
});

describe('test post /companies route', function () {
  test("Can we post a company", async function () {
    const response = await request(app).post('/companies').send(c2);
    expect(response.body).toEqual({
      company: {
        ...c2
      }
    });

    const newResponse = await request(app).get('/companies');
    expect(Object.keys(newResponse.body.companies).length).toEqual(2);
  });
});

describe('get /companies/:handle route', function () {
  test("Can we get a company by the handle", async function () {
    const response = await request(app).get(`/companies/${c1.handle}`);

    expect(response.body).toEqual({ company: { ...c1 } })
  });

  test("Do we get a 404 if we put in the wrong handle", async function () {
    const response = await request(app).get(`/companies/00000`);

    expect(response.statusCode).toEqual(404);
  });

});

describe('patch /companies/:handle route', function () {
  test("Can we update a company by the handle", async function () {
    const response = await request(app).patch(`/companies/${c1.handle}`).send(c2);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ company: { ...c2 } });
  });

  test("Do we get a 404 when trying to change a handle that doesn't exist", async function () {
    const response = await request(app).patch(`/companies/${c2.handle}`).send(c2);

    expect(response.statusCode).toEqual(404);
  });
});


afterAll(async function () {
  await db.end();
});