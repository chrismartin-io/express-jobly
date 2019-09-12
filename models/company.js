// Company class 

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const partialUpdate = require("../helpers/partialUpdate");

class Company {


  // search with min and max

  static async searchAll(search, min, max) {
    const result = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE num_employees > $2
      AND num_employees < $3
      AND (handle || name) LIKE $1`,
      [`%${search}%`, min, max]);


      
    return result.rows;
  }

  static async create(req){
    const handle = req.body.handle;
    const name = req.body.name;
    const num_employees =  req.body.num_employees;
    const description = req.body.description
    const logo_url = req.body.logo_url;

    const result = await db.query(`
    INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING handle, name, num_employees, description, logo_url`,
    [handle, name, num_employees, description, logo_url]);

    return result.rows[0];
  };


  // get and return all companies

  static async all() {
    const result = await db.query(
      `SELECT handle, name 
      FROM companies`
    );

    return result.rows;
  }

// get company by handle
  static async getHandle(handle){
    const result = await db.query(
      `SELECT *
      FROM companies
      WHERE handle = $1`,
      [handle]
    );
    
    return result.rows[0];
  }

// update company by handle
static async updateHandle(req, handle){
  const queryObj = partialUpdate("companies", req.body, "handle", handle);
  const result =  await db.query(queryObj.query,queryObj.values);

  return result.rows[0];
};

  // search query with a min or max value
  static async searchMinOrMax(search, value, operator) {
    const query = `
    SELECT handle, name
    FROM companies
    WHERE num_employees ${operator} $2
    AND (handle || name) LIKE $1`;

    const result = await db.query(query,
      [`%${search}%`, value]);

    return result.rows;
  };

  // db with min and max.
  static async minAndMax(minVal, maxVal) {
    const result = await db.query(`
    SELECT handle, name
    FROM companies
    WHERE num_employees >= $1
    AND num_employees <= $2`,
      [minVal, maxVal]);

    return result.rows;
  };

  // search query by itself
  static async search(searchVal) {
    const result = await db.query(`
    SELECT handle, name
    FROM companies
    WHERE (handle || name) LIKE $1`,
      [`%${searchVal}%`]);

    return result.rows;
  };

  // db query with min or max
  static async singleMinOrMax(val, operator) {
    const query = `
    SELECT handle, name
    FROM companies
    WHERE num_employees ${operator} $1`;

    const result = await db.query(query,
      [val]);

    return result.rows;
  };



  

  static async getCompanies(req) {

    // If we have all three query params we will search for all of them
    if (req.query.search && req.query.min_employees &&
      req.query.max_employees) {
      const result = await Company.searchAll(req.query.search,
        req.query.min_employees, req.query.max_employees);
      return result;

    }
    // If 'search' and 'min' are in the query we will search for 'min employees'
    else if (req.query.search && req.query.min_employees) {
      const result = await Company.searchMinOrMax(req.query.search, req.query.min_employees, `>=`);
      return result;

    }
    // If 'search' and 'max' are in query we will search for 'max employees'
    else if (req.query.search && req.query.max_employees) {
      const result = await Company.searchMinOrMax(req.query.search, req.query.max_employees, `<=`);
      return result;

    }
    // If min and 'max search' are in query we will search by employee number
    else if (req.query.min_employees && req.query.max_employees) {
      const result = await Company.minAndMax(req.query.min_employees, req.query.max_employees);
      return result;
    }
    // search if 'search' query is present
    else if (req.query.search) {
      const result = await Company.search(req.query.search);
      return result;
    }
    //search if 'min employees' is present
    else if (req.query.min_employees) {
      const result = await Company.singleMinOrMax(req.query.min_employees, `>=`);
      return result;
    }
    //search if 'max employees' is present
    else if (req.query.max_employees) {
      const result = await Company.singleMinOrMax(req.query.max_employees, `<=`);
      return result;
    }
    // else return all of the companies
    else {
      const result = await Company.all();
      return result;
    };
  };

};


module.exports = Company;