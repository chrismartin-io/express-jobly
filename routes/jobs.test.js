const Company = require('../models/company');
const db = require("../db");
const request = require("supertest")
process.env.NODE_ENV = 'test';
const app = require('../app');
const Job = require("../models/job");

let c1;
let j1;
let j2;

beforeEach(async function () {
  await db.query(`DELETE FROM companies`)
  await db.query(`DELETE FROM jobs`)
  c1 = {
    handle: "M32",
    name: "Mic3elSoft2",
    description: "Like MS paint for some reason.",
    logo_url: "http://wesoscary.org",
    num_employees: 5000
  }

  c1 = await Company.create(c1);

  j1 = {
    title: "The not the best job ever",
    salary: 45,
    equity: 0.5,
    company_handle: "M32"
  };

  j2 = {
    title: "The best job ever 2.0",
    salary: 50,
    equity: 0.5,
    company_handle: "M32"
  }
  j2 = await Job.create(j2);
});

describe("POST /jobs route", function () {
  test("Can we create a job", async function () {
    const response = await request(app).post("/jobs/").send(j1);
    console.log(response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ job: { ...j1, date_posted: expect.any(String), id: response.body.job.id } });
  });
  test("Can we get an error if we leave out a key", async function () {
    const response = await request(app).post("/jobs/").send({
      salary: 45,
      equity: 0.5,
      company_handle: "M32"
    })

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      "status": 400,
      "message": [
        "instance requires property \"title\""
      ]
    });
  });

  describe("GET /jobs route", async function () {
    test("Can we get all of the jobs", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get('/jobs/');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j2.title, company_handle: j2.company_handle }, { title: j1.title, company_handle: j1.company_handle }] });

    });
    test("Can search by title", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?search=2.0`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j2.title, company_handle: j2.company_handle }] });

    });
    test("Can we search by company handle", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?search=${j2.company_handle}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j2.title, company_handle: j2.company_handle }, { title: j1.title, company_handle: j1.company_handle }] });
    });
    test("Can we search by min_salary", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?min_salary=${j2.salary}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j2.title, company_handle: j2.company_handle }] });
    });
    test("Can we search by max_salary", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?max_salary=${j2.salary - 1}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j1.title, company_handle: j1.company_handle }] });
    });
    test("Can we search by all querys", async function () {
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?min_salary=${j1.salary + 1}&search=M3&max_salary=${j2.salary}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [{ title: j2.title, company_handle: j2.company_handle }] });
    });
    test("Can we get nothing", async function(){
      j1 = await Job.create(j1);
      const response = await request(app).get(`/jobs/?min_salary=${j1.salary + 1}&search=M3&max_salary=${j2.salary-1}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ jobs: [] });

    });
  });

});




afterAll(async function () {
  await db.end();
});