const express = require("express");
const Company = require("../models/company");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const db = require("../db");
const getCompanies = require('../helpers/getCompanies')


router.get('/', async function (req, res, next) {
  try {

    let result = await getCompanies(req);
    return res.json({
      companies: result
    });
  } catch (err) {
    return next(err);
  }
})



module.exports = router;