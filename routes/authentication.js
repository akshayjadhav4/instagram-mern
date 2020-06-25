var express = require('express')
var router = express.Router()

const {signup} = require("../controllers/authentication")

router.post("/signup",signup)



module.exports = router