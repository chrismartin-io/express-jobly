// Company class 

const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {


  // search with min and max

  static async searchAll(search, min, max) {
    const result = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE num_employees > $2
      AND num_employees < $3
      AND handle LIKE $1
      OR name LIKE $1`,
      [`%${search}%`, min, max]);
    
    return result.rows;
  }

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