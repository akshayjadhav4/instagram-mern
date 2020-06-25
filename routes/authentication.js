var express = require('express')
var router = express.Router()


router.get("/signout",(req,res)=>{
    res.send("user Signout")
})

module.exports = router