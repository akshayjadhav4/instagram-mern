var express = require('express')
var router = express.Router()
const { check } = require('express-validator');

const {signup,signin,signout} = require("../controllers/authentication")

router.post(
  "/signup",
  [
    check("fullname")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    check("email").isEmail().withMessage("provide valid email"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    check("email").isEmail().withMessage("provide valid email"),
  ],
  signin
);

router.get("/signout",signout)

module.exports = router