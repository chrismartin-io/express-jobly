const db = require("../db");
const Company = require("../models/company");
const ExpressError = require('../helpers/expressError');


async function getCompanies(req) {
  if (req.query.search && req.query.min_employees &&
    req.query.max_employees) {
    let result = await Company.searchAll(req.query.search, 
      req.query.min_employees, req.query.max_employees);
    return result;
  } else {
    let result = await Company.all();
    return result;
  }
}

module.exports = getCompanies;