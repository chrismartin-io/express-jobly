// Job class
const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

class Job {

  static async create(req) {
    const { title, salary, equity, company_handle } = req;
    const response = await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
      [title, salary, equity, company_handle]);


    return response.rows[0];
  };

  static async get(req) {
    let queryBuilder = 'SELECT title, company_handle FROM jobs WHERE'
    const valueArr = [];
    let indx = 1;

    if (req.search){
      queryBuilder = queryBuilder + ` (title || company_handle) LIKE $${indx} AND`;
      valueArr.push(`%${req.search}%`);
      indx++;
    } 
    if (req.min_salary) {
      queryBuilder = queryBuilder + ` salary >= $${indx} AND`;
      valueArr.push(Number(req.min_salary));
      indx++;
    } if (req.max_salary) {
      queryBuilder = queryBuilder + ` salary <= $${indx} AND`;
      valueArr.push(Number(req.max_salary));
      indx++;
    }
    if (indx !== 1){
      queryBuilder = queryBuilder.slice(0,-4);
    } else {
      queryBuilder = queryBuilder.slice(0,-5);
    }

    const response = await db.query(`${queryBuilder}`, valueArr);

    return response.rows;
  };


}

module.exports = Job;