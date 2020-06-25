const User = require("../models/user")

exports.signup = (req ,res)=>{
    const user = new User(req.body)
    user.save((error , user)=>{
        if (error) {
            return res.status(400).json({
                error : "Not able to create account "
            })
        }
        res.json(user)
    })
}
