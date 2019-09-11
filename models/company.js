// Company class 

const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {

  // get and return all companies

  static async all() {
    const result = await db.query(
      `SELECT handle, name 
      FROM companies`
    )
    return result.rows;
  }
}


module.exports = Company;