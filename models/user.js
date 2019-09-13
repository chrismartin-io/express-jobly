// User class 
const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");



class User {


  static async create(req) {
    const { username, password, first_name, last_name, email, photo_url, is_admin } = req;

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
    INSERT INTO users (username, password, first_name, last_name, email, photo_url, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING username, first_name, last_name, email, photo_url`,
      [username, hashedPassword, first_name, last_name, email, photo_url, is_admin]);

    return result.rows[0];
  }

  static async getAll(req) {
    const result = await db.query(`
  SELECT username, first_name, last_name, email
  FROM users`);

    return result.rows;
  }

  static async getByUsername(username) {
    const result = await db.query(`
    SELECT username, first_name, last_name, email, photo_url, is_admin
    FROM users
    WHERE username = $1`,
      [username]);

    return result.rows[0];
  }

  static async updateByUsername(req, username) {
    if (req.password) {
 
      const hashedPassword = await bcrypt.hash(req.password, BCRYPT_WORK_FACTOR);
      req.password = hashedPassword;
    }
    const queryObj = partialUpdate("users", req, "username", username);
    const result = await db.query(queryObj.query, queryObj.values);
    
    return result.rows[0];
  }

  static async delete(username){
    const result = await db.query(`
    DELETE FROM users
    WHERE username = $1
    RETURNING username`,
    [username]);

    return result.rows[0];
  }

};

module.exports = User;