const express = require("express");
const Company = require("../models/company");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const db = require("../db");


router.get('/', async function (req, res, next) {
  try {

    let companies = await Company.all();
    return res.json({ companies });

  } catch (err) {
    return next(err);
  }
})



module.exports = router;