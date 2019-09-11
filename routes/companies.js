const express = require("express");
const Company = require("../models/company");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const db = require("../db");


router.get('/', async function (req, res, next) {
  try {

    let result = await Company.getCompanies(req);
    return res.json({
      companies: result
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {

    let company = await Company.create(req);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;