const express = require("express");
const Job = require("../models/job");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const jsonschema = require("jsonschema");
const jobsCreateSchema = require("../schemas/jobsCreateSchema");
// const companiesPatchSchema = require("../schemas/companiesPatchSchema")

// Creates a new job
router.post("/", async function (req, res, next) {
  const resultValid = jsonschema.validate(req.body, jobsCreateSchema);

  if (!resultValid.valid) {
    let listOfErrors = resultValid.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    const job = await Job.create(req.body);

    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function(req, res, next){

  try {
    const jobs = await Job.get(req.query);

    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});



module.exports = router