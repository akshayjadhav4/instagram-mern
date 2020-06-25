var express = require('express')
var router = express.Router()

const {signOut} = require("../controllers/authentication")

router.get("/signout",signOut)

module.exports = router