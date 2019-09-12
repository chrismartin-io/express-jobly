const express = require("express");
const Company = require("../models/company");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const jsonschema = require("jsonschema");
const companiesCreateSchema = require("../schemas/companiesCreateSchema");
const companiesPatchSchema = require("../schemas/companiesPatchSchema")


// Router get all companies
router.get('/', async function (req, res, next) {
  try {

    let companies = await Company.getCompanies(req.body);
    return res.json({
      companies
    });
  } catch (err) {
    return next(err);
  }
});


// Route post route
router.post('/', async function (req, res, next) {

  // JSON Schema
  const resultValid = jsonschema.validate(req.body, companiesCreateSchema);

  if (!resultValid.valid) {
    let listOfErrors = resultValid.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    let company = await Company.create(req.body);
    return res.json({
      company
    });
  } catch (err) {
    return next(err);
  }
});


// Router get specific 
router.get('/:handle', async function (req, res, next) {
  try {

    let company = await Company.getHandle(req.params.handle);
    if (!company) {
      throw new ExpressError("Company not found", 404);
    }
    return res.json({
      company
    });
  } catch (err) {
    return next(err);
  }
});


// Router patch route
router.patch('/:handle', async function (req, res, next) {

  // JSON Schema

  const resultValid = jsonschema.validate(req.body, companiesPatchSchema);

  if (!resultValid.valid) {
    let listOfErrors = resultValid.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {

    let handle = req.params.handle;
    let company = await Company.updateHandle(req, handle);
    if (!company) {
      throw new ExpressError("Company not found", 404);
    };
    return res.json({
      company
    });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;