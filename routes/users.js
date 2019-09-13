const express = require("express");
const User = require("../models/user");
const ExpressError = require('../helpers/expressError');
const router = new express.Router();
const jsonschema = require("jsonschema");
const usersCreateSchema = require("../schemas/usersCreateSchema");
// const usersPatchSchema = require("../schemas/usersPatchSchema");


router.post("/", async function (req, res, next) {

  const resultValid = jsonschema.validate(req.body, usersCreateSchema);

  if (!resultValid.valid) {
    let listOfErrors = resultValid.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


router.get("/", async function (req, res, next) {

  try {
    const users = await User.getAll(req.body);

    res.json({ users });
  } catch (err) {
    return next(err);
  }
});


router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.getByUsername(req.params.username);

    res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:username", async function (req, res, next) {
  const resultValid = jsonschema.validate(req.body, usersPatchSchema);

  if (!resultValid.valid) {
    let listOfErrors = resultValid.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    const user = await User.updateByUsername(req.body, req.params.user);

    res.json({ user });
  } catch (err) {
    return next(err);
  }

});
router.delete("/:username", async function (req, res, next) {
  try {
    const user = await User.delete(req.params.username);

    if (!user) {
      throw new ExpressError("User not found", 404);
    }

    return res.json({
      message: "User deleted"
    });
  }
  catch (err) {
    return next(err);
  }

});


module.exports = router;